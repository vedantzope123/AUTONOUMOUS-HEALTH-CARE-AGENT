import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import {
  FiActivity,
  FiAlertCircle,
  FiCalendar,
  FiMessageCircle,
  FiClock,
  FiTrendingUp,
  FiArrowRight,
} from 'react-icons/fi';
import { MdHealthAndSafety } from 'react-icons/md';
import { formatDateTime, isToday } from '../utils/helpers';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    vitals,
    symptoms,
    appointments,
    chatHistory,
    dietRecommendations,
    healthReports,
  } = useAppContext();

  const latestVitals = vitals.length > 0 ? vitals[vitals.length - 1] : null;
  const latestSymptom = symptoms.length > 0 ? symptoms[symptoms.length - 1] : null;
  const todaySymptoms = symptoms.filter((s) => isToday(s.date));
  const upcomingAppointments = appointments.filter((a) => a.status === 'scheduled');
  const todayChat = chatHistory.filter((m) => isToday(m.timestamp));

  const quickStats = [
    {
      label: 'Total Vitals Logged',
      value: vitals.length,
      icon: FiActivity,
      color: 'from-blue-500 to-cyan-500',
      onClick: () => navigate('/vitals'),
    },
    {
      label: 'Symptoms Tracked',
      value: symptoms.length,
      icon: FiAlertCircle,
      color: 'from-orange-500 to-red-500',
      onClick: () => navigate('/symptoms'),
    },
    {
      label: 'Upcoming Appointments',
      value: upcomingAppointments.length,
      icon: FiCalendar,
      color: 'from-purple-500 to-pink-500',
      onClick: () => navigate('/appointments'),
    },
    {
      label: 'Health Reports',
      value: healthReports.length,
      icon: FiTrendingUp,
      color: 'from-green-500 to-emerald-500',
      onClick: () => navigate('/report'),
    },
  ];

  return (
    <div className="md:ml-64 min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary-900 mb-2">Welcome Back!</h1>
          <p className="text-primary-600 text-lg">
            Here's your health overview for today
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map(({ label, value, icon: Icon, color, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className={`bg-gradient-to-br ${color} rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform cursor-pointer`}
            >
              <Icon size={28} className="mb-3 opacity-80" />
              <p className="text-3xl font-bold">{value}</p>
              <p className="text-sm opacity-90 mt-1">{label}</p>
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Latest Vitals Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary-900 flex items-center gap-2">
                <FiActivity className="text-blue-500" /> Latest Vitals
              </h2>
              <button
                onClick={() => navigate('/vitals')}
                className="text-primary-500 hover:text-primary-700 p-1"
              >
                <FiArrowRight />
              </button>
            </div>

            {latestVitals ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg">
                  <span className="text-primary-700 font-semibold">Blood Pressure</span>
                  <span className="text-primary-900 font-bold">
                    {latestVitals.bloodPressureSystolic}/{latestVitals.bloodPressureDiastolic}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg">
                  <span className="text-primary-700 font-semibold">Heart Rate</span>
                  <span className="text-primary-900 font-bold">{latestVitals.heartRate} bpm</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg">
                  <span className="text-primary-700 font-semibold">Temperature</span>
                  <span className="text-primary-900 font-bold">{latestVitals.temperature}°F</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg">
                  <span className="text-primary-700 font-semibold">Oxygen Saturation</span>
                  <span className="text-primary-900 font-bold">{latestVitals.oxygenSaturation}%</span>
                </div>
                <p className="text-xs text-primary-500 text-center mt-3">
                  Last updated: {formatDateTime(latestVitals.date)}
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-primary-500">
                <p className="mb-3">No vitals logged yet</p>
                <button
                  onClick={() => navigate('/vitals')}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Log Vitals
                </button>
              </div>
            )}
          </div>

          {/* Symptoms Today Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary-900 flex items-center gap-2">
                <FiAlertCircle className="text-orange-500" /> Today's Symptoms
              </h2>
              <button
                onClick={() => navigate('/symptoms')}
                className="text-primary-500 hover:text-primary-700 p-1"
              >
                <FiArrowRight />
              </button>
            </div>

            {todaySymptoms.length > 0 ? (
              <div className="space-y-3">
                {todaySymptoms.map((symptom) => (
                  <div key={symptom.id} className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                    <p className="text-sm font-semibold text-primary-900 mb-1">
                      {symptom.symptoms.join(', ')}
                    </p>
                    <p className="text-xs text-orange-600">
                      Severity: <span className="font-bold capitalize">{symptom.severity}</span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-primary-500">
                <p className="mb-3">No symptoms logged today</p>
                <p className="text-sm mb-3">
                  {latestSymptom && (
                    <>
                      Last entry: {latestSymptom.symptoms.join(', ')} ({latestSymptom.date})
                    </>
                  )}
                </p>
                <button
                  onClick={() => navigate('/symptoms')}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Log Symptoms
                </button>
              </div>
            )}
          </div>

          {/* Upcoming Appointments Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary-900 flex items-center gap-2">
                <FiCalendar className="text-purple-500" /> Appointments
              </h2>
              <button
                onClick={() => navigate('/appointments')}
                className="text-primary-500 hover:text-primary-700 p-1"
              >
                <FiArrowRight />
              </button>
            </div>

            {upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.slice(0, 3).map((apt) => (
                  <div key={apt.id} className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                    <p className="text-sm font-semibold text-primary-900">Dr. {apt.doctorName}</p>
                    <p className="text-xs text-purple-600 mt-1">
                      {apt.date} at {apt.time}
                    </p>
                    <p className="text-xs text-primary-600 mt-1">{apt.hospital}</p>
                  </div>
                ))}
                {upcomingAppointments.length > 3 && (
                  <p className="text-xs text-primary-500 text-center pt-2">
                    +{upcomingAppointments.length - 3} more appointments
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-primary-500">
                <p className="mb-3">No upcoming appointments</p>
                <button
                  onClick={() => navigate('/appointments')}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Book Appointment
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Secondary Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Nurse Chat Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary-900 flex items-center gap-2">
                <FiMessageCircle className="text-cyan-500" /> AI Nurse Assistant
              </h2>
              <button
                onClick={() => navigate('/nurse')}
                className="text-primary-500 hover:text-primary-700 p-1"
              >
                <FiArrowRight />
              </button>
            </div>

            <p className="text-primary-600 text-sm mb-4">
              Chat with your AI Nurse for health advice, symptom guidance, and wellness tips.
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-primary-200">
              <span className="text-sm text-primary-600">
                {todayChat.length} messages today
              </span>
              <button
                onClick={() => navigate('/nurse')}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
              >
                <FiMessageCircle size={16} /> Chat Now
              </button>
            </div>
          </div>

          {/* Diet Plans Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary-900 flex items-center gap-2">
                <FiClock className="text-orange-500" /> Diet & Nutrition
              </h2>
              <button
                onClick={() => navigate('/diet')}
                className="text-primary-500 hover:text-primary-700 p-1"
              >
                <FiArrowRight />
              </button>
            </div>

            <p className="text-primary-600 text-sm mb-4">
              Get personalized meal plans based on your health condition and preferences.
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-primary-200">
              <span className="text-sm text-primary-600">
                {dietRecommendations.length} meal plans created
              </span>
              <button
                onClick={() => navigate('/diet')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
              >
                Create Plan
              </button>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-8 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-2xl shadow-xl p-8 text-white text-center">
          <MdHealthAndSafety size={48} className="mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold mb-2">Stay Healthy, Stay Informed</h2>
          <p className="mb-4 opacity-90">
            Regularly log your vitals and symptoms to get better health insights and recommendations.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate('/vitals')}
              className="bg-white hover:bg-gray-100 text-primary-600 font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Log Vitals Today
            </button>
            <button
              onClick={() => navigate('/nurse')}
              className="bg-white hover:bg-gray-100 text-primary-600 font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Talk to AI Nurse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
