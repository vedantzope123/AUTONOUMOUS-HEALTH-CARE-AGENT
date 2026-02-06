export interface HospitalLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance: number; // in km
  phone: string;
  email?: string;
  website?: string;
  types: string[];
  rating?: number;
  reviews?: number;
}

type OverpassElement = {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

type OverpassResponse = {
  elements: OverpassElement[];
};

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export class HospitalLocatorService {
  private userLocation: UserLocation | null = null;

  constructor() {}

  /**
   * Get user's current location using Geolocation API
   */
  async getUserLocation(): Promise<UserLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          resolve(this.userLocation);
        },
        (error) => {
          // Fallback to default location (New York)
          this.userLocation = {
            latitude: 40.7128,
            longitude: -74.006,
          };
          console.warn('Geolocation error, using default location:', error);
          resolve(this.userLocation);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 10) / 10;
  }

  /**
   * Get nearby hospitals from OpenStreetMap (Overpass API)
   */
  async getNearbyHospitals(radiusKm: number = 10): Promise<HospitalLocation[]> {
    if (!this.userLocation) {
      await this.getUserLocation();
    }

    const userLat = this.userLocation!.latitude;
    const userLon = this.userLocation!.longitude;
    const radiusMeters = Math.max(1, Math.round(radiusKm * 1000));

    const query = `[
      out:json][timeout:25];
      (
        node["amenity"="hospital"](around:${radiusMeters},${userLat},${userLon});
        way["amenity"="hospital"](around:${radiusMeters},${userLat},${userLon});
        relation["amenity"="hospital"](around:${radiusMeters},${userLat},${userLon});
      );
      out center tags;
    `;

    const body = new URLSearchParams({ data: query });
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch nearby hospitals. Please try again.');
    }

    const data = (await response.json()) as OverpassResponse;
    const elements = data.elements || [];

    const hospitals = elements
      .map((element) => {
        const tags = element.tags || {};
        const latitude = element.lat ?? element.center?.lat ?? 0;
        const longitude = element.lon ?? element.center?.lon ?? 0;
        const addressParts = [
          tags['addr:housenumber'],
          tags['addr:street'],
          tags['addr:city'],
          tags['addr:state'],
          tags['addr:postcode'],
        ].filter(Boolean);

        const name = tags.name || 'Hospital';
        const address =
          tags['addr:full'] || (addressParts.length ? addressParts.join(' ') : 'Address unavailable');
        const phone = tags['contact:phone'] || tags.phone || 'Not available';
        const website = tags['contact:website'] || tags.website;

        const types = [
          tags.healthcare,
          tags['healthcare:speciality'],
          tags.amenity,
        ]
          .filter(Boolean)
          .map((value) => value.replace(/_/g, ' '));

        return {
          id: String(element.id),
          name,
          address,
          latitude,
          longitude,
          distance: this.calculateDistance(userLat, userLon, latitude, longitude),
          phone,
          website,
          types: types.length ? types : ['Hospital'],
        } as HospitalLocation;
      })
      .filter((hospital) => hospital.latitude !== 0 && hospital.longitude !== 0)
      .filter((hospital) => hospital.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);

    return hospitals;
  }

  /**
   * Generate Google Maps URL for a hospital
   */
  generateMapsUrl(hospital: HospitalLocation): string {
    const query = encodeURIComponent(`${hospital.name} ${hospital.address}`);
    return `https://www.google.com/maps/search/${query}`;
  }

  /**
   * Generate Google Maps embed URL
   */
  generateMapsEmbedUrl(hospital: HospitalLocation): string {
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1234567890!2d${hospital.longitude}!3d${hospital.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${hospital.latitude}%2C${hospital.longitude}!5e0!3m2!1sen!2sus!4v1234567890`;
  }

  /**
   * Get directions URL for navigation
   */
  getDirectionsUrl(hospital: HospitalLocation): string {
    if (!this.userLocation) {
      return '#';
    }
    return `https://www.google.com/maps/dir/${this.userLocation.latitude},${this.userLocation.longitude}/${hospital.latitude},${hospital.longitude}`;
  }

  /**
   * Call hospital
   */
  callHospital(phoneNumber: string): void {
    window.location.href = `tel:${phoneNumber}`;
  }

  /**
   * Send SMS to hospital
   */
  smsHospital(phoneNumber: string, message: string): void {
    window.location.href = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
  }
}

// Export singleton instance
let locatorInstance: HospitalLocatorService | null = null;

export function getHospitalLocator(): HospitalLocatorService {
  if (!locatorInstance) {
    locatorInstance = new HospitalLocatorService();
  }
  return locatorInstance;
}
