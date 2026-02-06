import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { NurseChat } from './pages/NurseChat';
import { VitalsTracker } from './pages/VitalsTracker';
import { SymptomsLogger } from './pages/SymptomsLogger';
import { AppointmentsHub } from './pages/AppointmentsHub';
import { DietPlan } from './pages/DietPlan';
import { HealthReports } from './pages/HealthReports';
import { HospitalLocator } from './pages/HospitalLocator';
import { ReceiptAnalyzer } from './pages/ReceiptAnalyzer';
import { Settings } from './pages/Settings';
import { About } from './pages/About';

function AppContent() {
  const { isConfigured } = useAppContext();

  return (
    <>
      <Navigation />
      <VoiceSettingsModal />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={isConfigured ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/nurse"
          element={isConfigured ? <NurseChat /> : <Navigate to="/" />}
        />
        <Route
          path="/vitals"
          element={isConfigured ? <VitalsTracker /> : <Navigate to="/" />}
        />
        <Route
          path="/symptoms"
          element={isConfigured ? <SymptomsLogger /> : <Navigate to="/" />}
        />
        <Route
          path="/appointments"
          element={isConfigured ? <AppointmentsHub /> : <Navigate to="/" />}
        />
        <Route
          path="/diet"
          element={isConfigured ? <DietPlan /> : <Navigate to="/" />}
        />
        <Route
          path="/report"
          element={isConfigured ? <HealthReports /> : <Navigate to="/" />}
        />
        <Route
          path="/hospitals"
          element={isConfigured ? <HospitalLocator /> : <Navigate to="/" />}
        />
        <Route
          path="/receipt"
          element={isConfigured ? <ReceiptAnalyzer /> : <Navigate to="/" />}
        />
        <Route
          path="/settings"
          element={isConfigured ? <Settings /> : <Navigate to="/" />}
        />
        <Route
          path="/about"
          element={<About />}
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  );
}

export default App;

