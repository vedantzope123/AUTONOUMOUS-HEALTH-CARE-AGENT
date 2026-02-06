import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  ChatMessage,
  HealthVitals,
  Symptom,
  Appointment,
  DietRecommendation,
  HealthReport,
  UserProfile,
} from '../types';
import type { VoiceSettings } from '../services/VoiceAssistantService';

interface AppContextType {
  // API Key Management
  apiKey: string | null;
  setApiKey: (key: string) => void;
  isConfigured: boolean;

  // User Profile
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;

  // Chat History
  chatHistory: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChatHistory: () => void;

  // Health Data
  vitals: HealthVitals[];
  addVitals: (vital: HealthVitals) => void;
  getLatestVitals: () => HealthVitals | null;

  symptoms: Symptom[];
  addSymptom: (symptom: Symptom) => void;

  // Appointments
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  cancelAppointment: (id: string) => void;

  // Diet Recommendations
  dietRecommendations: DietRecommendation[];
  addDietRecommendation: (recommendation: DietRecommendation) => void;

  // Health Reports
  healthReports: HealthReport[];
  addHealthReport: (report: HealthReport) => void;

  // Loading and error states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;

  // Voice Assistant Settings
  voiceSettings: VoiceSettings;
  setVoiceSettings: (settings: VoiceSettings) => void;
  updateVoiceSettings: (settings: Partial<VoiceSettings>) => void;

  // Theme Management
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  API_KEY: 'aura_health_api_key',
  USER_PROFILE: 'aura_health_user_profile',
  CHAT_HISTORY: 'aura_health_chat_history',
  VITALS: 'aura_health_vitals',
  SYMPTOMS: 'aura_health_symptoms',
  APPOINTMENTS: 'aura_health_appointments',
  DIET_RECOMMENDATIONS: 'aura_health_diet_recommendations',
  HEALTH_REPORTS: 'aura_health_health_reports',
  VOICE_SETTINGS: 'aura_health_voice_settings',
  THEME: 'aura_health_theme',
};

const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  speechLanguage: 'en-US',
  voiceLanguage: 'en-US',
  rate: 1,
  pitch: 1,
  volume: 1,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [vitals, setVitals] = useState<HealthVitals[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dietRecommendations, setDietRecommendations] = useState<DietRecommendation[]>([]);
  const [healthReports, setHealthReports] = useState<HealthReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voiceSettings, setVoiceSettingsState] = useState<VoiceSettings>(DEFAULT_VOICE_SETTINGS);
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');

  // Load data from localStorage on mount
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const savedApiKey = localStorage.getItem(STORAGE_KEYS.API_KEY);
        if (savedApiKey) setApiKeyState(savedApiKey);

        const savedUserProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
        if (savedUserProfile) setUserProfileState(JSON.parse(savedUserProfile));

        const savedChatHistory = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
        if (savedChatHistory) setChatHistory(JSON.parse(savedChatHistory));

        const savedVitals = localStorage.getItem(STORAGE_KEYS.VITALS);
        if (savedVitals) setVitals(JSON.parse(savedVitals));

        const savedSymptoms = localStorage.getItem(STORAGE_KEYS.SYMPTOMS);
        if (savedSymptoms) setSymptoms(JSON.parse(savedSymptoms));

        const savedAppointments = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
        if (savedAppointments) setAppointments(JSON.parse(savedAppointments));

        const savedDietRecommendations = localStorage.getItem(STORAGE_KEYS.DIET_RECOMMENDATIONS);
        if (savedDietRecommendations) setDietRecommendations(JSON.parse(savedDietRecommendations));

        const savedHealthReports = localStorage.getItem(STORAGE_KEYS.HEALTH_REPORTS);
        if (savedHealthReports) setHealthReports(JSON.parse(savedHealthReports));

        const savedVoiceSettings = localStorage.getItem(STORAGE_KEYS.VOICE_SETTINGS);
        if (savedVoiceSettings) setVoiceSettingsState(JSON.parse(savedVoiceSettings));

        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
        if (savedTheme) {
          setThemeState(savedTheme as 'dark' | 'light');
          applyTheme(savedTheme as 'dark' | 'light');
        }
      } catch (err) {
        console.error('Error loading from localStorage:', err);
      }
    };

    loadFromStorage();
  }, []);

  // Apply theme to DOM
  const applyTheme = (selectedTheme: 'dark' | 'light') => {
    const root = document.documentElement;
    if (selectedTheme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  };

  const setTheme = (selectedTheme: 'dark' | 'light') => {
    setThemeState(selectedTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, selectedTheme);
    applyTheme(selectedTheme);
  };

  // Save API key to localStorage
  const setApiKey = (key: string) => {
    setApiKeyState(key);
    if (key) {
      localStorage.setItem(STORAGE_KEYS.API_KEY, key);
    } else {
      localStorage.removeItem(STORAGE_KEYS.API_KEY);
    }
  };

  // Save user profile
  const setUserProfile = (profile: UserProfile) => {
    setUserProfileState(profile);
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  };

  // Chat operations with auto-save
  const addChatMessage = (message: ChatMessage) => {
    const updated = [...chatHistory, message];
    setChatHistory(updated);
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(updated));
  };

  const clearChatHistory = () => {
    setChatHistory([]);
    localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
  };

  // Vitals operations with auto-save
  const addVitals = (vital: HealthVitals) => {
    const updated = [...vitals, vital];
    setVitals(updated);
    localStorage.setItem(STORAGE_KEYS.VITALS, JSON.stringify(updated));
  };

  const getLatestVitals = () => {
    return vitals.length > 0 ? vitals[vitals.length - 1] : null;
  };

  // Symptoms operations with auto-save
  const addSymptom = (symptom: Symptom) => {
    const updated = [...symptoms, symptom];
    setSymptoms(updated);
    localStorage.setItem(STORAGE_KEYS.SYMPTOMS, JSON.stringify(updated));
  };

  // Appointments operations with auto-save
  const addAppointment = (appointment: Appointment) => {
    const updated = [...appointments, appointment];
    setAppointments(updated);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
  };

  const cancelAppointment = (id: string) => {
    const updated = appointments.map((apt) =>
      apt.id === id ? { ...apt, status: 'cancelled' as const } : apt
    );
    setAppointments(updated);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
  };

  // Diet Recommendations operations with auto-save
  const addDietRecommendation = (recommendation: DietRecommendation) => {
    const updated = [...dietRecommendations, recommendation];
    setDietRecommendations(updated);
    localStorage.setItem(STORAGE_KEYS.DIET_RECOMMENDATIONS, JSON.stringify(updated));
  };

  // Health Reports operations with auto-save
  const addHealthReport = (report: HealthReport) => {
    const updated = [...healthReports, report];
    setHealthReports(updated);
    localStorage.setItem(STORAGE_KEYS.HEALTH_REPORTS, JSON.stringify(updated));
  };

  // Voice Settings operations with auto-save
  const setVoiceSettings = (settings: VoiceSettings) => {
    setVoiceSettingsState(settings);
    localStorage.setItem(STORAGE_KEYS.VOICE_SETTINGS, JSON.stringify(settings));
  };

  const updateVoiceSettings = (settings: Partial<VoiceSettings>) => {
    const updated = { ...voiceSettings, ...settings };
    setVoiceSettingsState(updated);
    localStorage.setItem(STORAGE_KEYS.VOICE_SETTINGS, JSON.stringify(updated));
  };

  const value: AppContextType = {
    apiKey,
    setApiKey,
    isConfigured: !!apiKey,
    userProfile,
    setUserProfile,
    chatHistory,
    addChatMessage,
    clearChatHistory,
    vitals,
    addVitals,
    getLatestVitals,
    symptoms,
    addSymptom,
    appointments,
    addAppointment,
    cancelAppointment,
    dietRecommendations,
    addDietRecommendation,
    healthReports,
    addHealthReport,
    isLoading,
    setIsLoading,
    error,
    setError,
    voiceSettings,
    setVoiceSettings,
    updateVoiceSettings,
    theme,
    setTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
