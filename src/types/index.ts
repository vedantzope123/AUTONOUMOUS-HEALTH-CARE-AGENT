// User Health Data Types
export interface HealthVitals {
  id: string;
  date: string;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  temperature: number;
  bloodSugar: number;
  oxygenSaturation: number;
}

export interface Symptom {
  id: string;
  date: string;
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  location?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'nurse';
  content: string;
  timestamp: string;
  isCritical?: boolean;
  criticalAlert?: string;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  hospital: string;
  doctorName: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface DietRecommendation {
  id: string;
  date: string;
  meals: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
  reason: string;
  notes: string;
}

export interface HealthReport {
  id: string;
  date: string;
  summary: string;
  recentSymptoms: string[];
  vitalsTrends: string;
  recommendations: string[];
}

export interface Hospital {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distance: number;
  phone: string;
  address: string;
  rating: number;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodType: string;
  allergies: string[];
  medicalConditions: string[];
  medications: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}
