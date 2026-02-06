/**
 * Utility functions for AuraHealth Medicare application
 */

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const dateStr = formatDate(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${dateStr} ${hours}:${minutes}`;
};

export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const getDaysSince = (date: string): number => {
  const past = new Date(date);
  const now = new Date();
  const diff = now.getTime() - past.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const getHoursSince = (date: string): number => {
  const past = new Date(date);
  const now = new Date();
  const diff = now.getTime() - past.getTime();
  return Math.floor(diff / (1000 * 60 * 60));
};

export const isToday = (date: string): boolean => {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
};

export const isThisWeek = (date: string): boolean => {
  const d = new Date(date);
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  return d >= weekAgo && d <= today;
};

export const getBloodPressureCategory = (systolic: number, diastolic: number): string => {
  if (systolic < 120 && diastolic < 80) return 'Normal';
  if (systolic < 130 && diastolic < 80) return 'Elevated';
  if (systolic < 140 || diastolic < 90) return 'Stage 1 Hypertension';
  if (systolic >= 140 || diastolic >= 90) return 'Stage 2 Hypertension';
  if (systolic > 180 || diastolic > 120) return 'Hypertensive Crisis';
  return 'Unknown';
};

export const getHeartRateCategory = (heartRate: number, age: number): string => {
  const maxHR = 220 - age;

  if (heartRate < 60) return 'Bradycardia (Low)';
  if (heartRate <= 100) return 'Normal Resting';
  if (heartRate <= maxHR * 0.5) return 'Moderate';
  if (heartRate <= maxHR * 0.7) return 'Vigorous';
  return 'Very High';
};

export const getTemperatureCategory = (temp: number): string => {
  if (temp < 36.1) return 'Hypothermia (Low)';
  if (temp < 37.2) return 'Normal';
  if (temp < 38.3) return 'Fever (Mild)';
  if (temp < 39.4) return 'Fever (Moderate)';
  return 'Fever (High)';
};

export const getBloodSugarCategory = (sugar: number): string => {
  if (sugar < 70) return 'Low (Hypoglycemia)';
  if (sugar < 100) return 'Normal Fasting';
  if (sugar < 140) return 'Normal (Non-fasting)';
  if (sugar < 200) return 'High';
  return 'Very High';
};

export const getOxygenSaturationCategory = (o2: number): string => {
  if (o2 >= 95) return 'Excellent';
  if (o2 >= 90) return 'Good';
  if (o2 >= 85) return 'Fair (Low)';
  return 'Poor (Critical)';
};

export const calculateBMI = (weight: number, height: number): number => {
  // weight in kg, height in meters
  return weight / (height * height);
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

export const extractCriticalWarnings = (text: string): string[] => {
  const criticalPatterns = [
    /chest pain/gi,
    /severe bleeding/gi,
    /difficulty breathing/gi,
    /loss of consciousness/gi,
    /allergic reaction/gi,
    /poisoning/gi,
    /overdose/gi,
    /severe burn/gi,
    /severe trauma/gi,
    /heart attack/gi,
  ];

  const warnings: string[] = [];
  criticalPatterns.forEach((pattern) => {
    if (pattern.test(text)) {
      warnings.push(pattern.source.replace(/\\/g, ''));
    }
  });

  return warnings;
};

export const formatSymptomList = (symptoms: string[]): string => {
  if (symptoms.length === 0) return 'No symptoms reported';
  if (symptoms.length === 1) return symptoms[0];
  if (symptoms.length === 2) return symptoms.join(' and ');
  return symptoms.slice(0, -1).join(', ') + ', and ' + symptoms[symptoms.length - 1];
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const re = /^[\d\s\-+()]+$/;
  return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const parseSSN = (ssn: string): string => {
  const cleaned = ssn.replace(/\D/g, '');
  if (cleaned.length !== 9) return '';
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`;
};

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export const calculateAge = (birthDate: string): number => {
  const born = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - born.getFullYear();
  const monthDiff = today.getMonth() - born.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < born.getDate())) {
    age--;
  }
  return age;
};
