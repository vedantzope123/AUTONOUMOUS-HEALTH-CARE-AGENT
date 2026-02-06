import React, { useState, useEffect } from 'react';
import { FiMapPin, FiPhone, FiNavigation, FiLoader, FiMap } from 'react-icons/fi';
import { FaDirections } from 'react-icons/fa';
import type { HospitalLocation } from '../services/HospitalLocatorService';
import { getHospitalLocator } from '../services/HospitalLocatorService';

export const HospitalLocator: React.FC = () => {
  const [hospitals, setHospitals] = useState<HospitalLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<HospitalLocation | null>(null);
  const [radiusKm, setRadiusKm] = useState(10);
  const [error, setError] = useState<string | null>(null);

  const locator = getHospitalLocator();

  useEffect(() => {
    loadNearbyHospitals();
  }, []);

  const loadNearbyHospitals = async (radiusOverride?: number) => {
    setIsLoading(true);
    setError(null);
    try {
      // Get user location first
      await locator.getUserLocation();
      // Then load nearby hospitals
      const searchRadius = radiusOverride ?? radiusKm;
      const nearbyHospitals = await locator.getNearbyHospitals(searchRadius);
      setHospitals(nearbyHospitals);
      if (nearbyHospitals.length > 0) {
        setSelectedHospital(nearbyHospitals[0]);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load nearby hospitals. Please try again.'
      );
      console.error('Error loading hospitals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadiusKm(newRadius);
    loadNearbyHospitals(newRadius);
  };

  const handleCall = (phoneNumber: string) => {
    locator.callHospital(phoneNumber);
  };

  const handleDirections = (hospital: HospitalLocation) => {
    const url = locator.getDirectionsUrl(hospital);
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FiMap className="text-primary-600 text-3xl" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Nearest Hospitals
            </h1>
          </div>
          <p className="text-gray-600">Find and locate nearby healthcare facilities</p>
        </div>

        {/* Radius Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <label className="font-semibold text-gray-700">Search Radius:</label>
            <div className="flex gap-2">
              {[5, 10, 15, 20].map((radius) => (
                <button
                  key={radius}
                  onClick={() => handleRadiusChange(radius)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    radiusKm === radius
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                  }`}
                >
                  {radius} km
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <FiLoader className="animate-spin text-primary-600 text-4xl" />
          </div>
        )}

        {/* Main Content */}
        {!isLoading && hospitals.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Hospitals List */}
            <div className="lg:col-span-1 space-y-4 max-h-96 overflow-y-auto">
              {hospitals.map((hospital) => (
                <button
                  key={hospital.id}
                  onClick={() => setSelectedHospital(hospital)}
                  className={`w-full text-left p-4 rounded-xl transition ${
                    selectedHospital?.id === hospital.id
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-white text-gray-900 hover:shadow-md border border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{hospital.name}</h3>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{hospital.distance} km</div>
                      {hospital.rating && (
                        <div className="text-xs opacity-75">⭐ {hospital.rating}</div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm opacity-80">{hospital.address}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {hospital.types.slice(0, 2).map((type) => (
                      <span
                        key={type}
                        className={`text-xs px-2 py-1 rounded ${
                          selectedHospital?.id === hospital.id
                            ? 'bg-white/20'
                            : 'bg-primary-100 text-primary-700'
                        }`}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Hospital Details & Map */}
            <div className="lg:col-span-2 space-y-6">
              {selectedHospital && (
                <>
                  {/* Hospital Card */}
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Map Preview */}
                    <div className="w-full h-64 bg-gray-200 relative overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen={true}
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(
                          selectedHospital.name + ' ' + selectedHospital.address
                        )}&output=embed`}
                      ></iframe>
                    </div>

                    {/* Hospital Info */}
                    <div className="p-6 space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          {selectedHospital.name}
                        </h2>
                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                          <FiMapPin className="text-primary-600" />
                          <span>{selectedHospital.address}</span>
                        </div>

                        {/* Rating and Reviews */}
                        {selectedHospital.rating && (
                          <div className="flex items-center gap-4 py-3 border-y border-gray-200">
                            <div>
                              <div className="flex items-center gap-1">
                                <span className="text-2xl font-bold text-primary-600">
                                  {selectedHospital.rating}
                                </span>
                                <span className="text-lg">⭐</span>
                              </div>
                            </div>
                            {selectedHospital.reviews && (
                              <div className="text-gray-600">
                                ({selectedHospital.reviews} reviews)
                              </div>
                            )}
                            <div className="text-sm text-gray-500 ml-auto">
                              Distance: {selectedHospital.distance} km
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Hospital Types */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Services</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedHospital.types.map((type) => (
                            <span
                              key={type}
                              className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900">Contact</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 text-gray-700">
                            <FiPhone className="text-primary-600" />
                            <a
                              href={`tel:${selectedHospital.phone}`}
                              className="hover:text-primary-600 font-medium"
                            >
                              {selectedHospital.phone}
                            </a>
                          </div>
                          {selectedHospital.email && (
                            <div className="flex items-center gap-3 text-gray-700">
                              <span className="text-primary-600">✉</span>
                              <a
                                href={`mailto:${selectedHospital.email}`}
                                className="hover:text-primary-600"
                              >
                                {selectedHospital.email}
                              </a>
                            </div>
                          )}
                          {selectedHospital.website && (
                            <div className="flex items-center gap-3 text-gray-700">
                              <span className="text-primary-600">🌐</span>
                              <a
                                href={selectedHospital.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary-600"
                              >
                                {selectedHospital.website}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-3 pt-4">
                        <button
                          onClick={() => handleCall(selectedHospital.phone)}
                          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition shadow-md"
                        >
                          <FiPhone />
                          Call Now
                        </button>
                        <button
                          onClick={() => handleDirections(selectedHospital)}
                          className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition shadow-md"
                        >
                          <FaDirections />
                          Directions
                        </button>
                      </div>

                      {/* Map Link */}
                      <a
                        href={locator.generateMapsUrl(selectedHospital)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-xl transition"
                      >
                        <FiNavigation />
                        Open in Google Maps
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* No Hospitals Found */}
        {!isLoading && hospitals.length === 0 && !error && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FiMap className="text-primary-300 text-6xl mx-auto mb-4" />
            <p className="text-primary-600 font-semibold mb-2">No hospitals found</p>
            <p className="text-primary-500 text-sm">Try increasing the search radius or check back later</p>
          </div>
        )}
      </div>
    </div>
  );
};
