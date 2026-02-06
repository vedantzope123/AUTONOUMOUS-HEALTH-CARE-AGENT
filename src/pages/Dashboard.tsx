import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import {
  FiAlertCircle,
  FiCalendar,
  FiMessageCircle,
  FiClock,
  FiTrendingUp,
  FiArrowRight,
} from 'react-icons/fi';
import { MdHealthAndSafety, MdLocalHospital, MdFavorite } from 'react-icons/md';
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
  const todaySymptoms = symptoms.filter((s) => isToday(s.date));
  const upcomingAppointments = appointments.filter((a) => a.status === 'scheduled');
  const todayChat = chatHistory.filter((m) => isToday(m.timestamp));

  const quickStats = [
    {
      label: 'Total Vitals Logged',
      value: vitals.length,
      icon: MdFavorite,
      color: 'from-blue-500 to-cyan-500',
      onClick: () => navigate('/vitals'),
      delay: 0,
    },
    {
      label: 'Symptoms Tracked',
      value: symptoms.length,
      icon: FiAlertCircle,
      color: 'from-orange-500 to-red-500',
      onClick: () => navigate('/symptoms'),
      delay: 100,
    },
    {
      label: 'Upcoming Appointments',
      value: upcomingAppointments.length,
      icon: FiCalendar,
      color: 'from-purple-500 to-pink-500',
      onClick: () => navigate('/appointments'),
      delay: 200,
    },
    {
      label: 'Health Reports',
      value: healthReports.length,
      icon: FiTrendingUp,
      color: 'from-green-500 to-emerald-500',
      onClick: () => navigate('/report'),
      delay: 300,
    },
  ];

  return (
    <div className="md:ml-64 min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-cyan-900 relative overflow-hidden">
      {/* Floating Background Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="animate-float1 absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="animate-float2 absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="animate-float3 absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Animated Welcome Header */}
          <div className="mb-12 animate-slide-in-down">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse-glow">
                <MdHealthAndSafety size={28} className="text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Welcome Back!
              </h1>
            </div>
            <p className="text-cyan-200 text-lg font-semibold ml-15">Here's your comprehensive health overview</p>
          </div>

          {/* Quick Stats - 3D Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {quickStats.map(({ label, value, icon: Icon, color, onClick, delay }) => (
              <div
                key={label}
                style={{ animationDelay: `${delay}ms` }}
                className="animate-slide-in-up"
              >
                <button
                  onClick={onClick}
                  className={`group relative w-full bg-gradient-to-br ${color} rounded-2xl shadow-2xl p-8 text-white transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden hover-lift`}
                >
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <Icon size={40} className="mb-4 opacity-90 group-hover:animate-bounce-slow" />
                    <p className="text-5xl font-bold mb-2">{value}</p>
                    <p className="text-sm font-semibold opacity-90">{label}</p>
                    <FiArrowRight size={20} className="mt-3 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all" />
                  </div>
                </button>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Latest Vitals Card - 3D Glass */}
            <div className="lg:col-span-1 animate-slide-in-left" style={{ animationDelay: '0ms' }}>
              <div className="glass rounded-3xl shadow-2xl p-8 h-full backdrop-blur-xl border border-white/20 hover-lift group">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                      <MdFavorite className="text-white animate-heartbeat" size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-white">Latest Vitals</h2>
                  </div>
                  <button
                    onClick={() => navigate('/vitals')}
                    className="text-cyan-300 hover:text-cyan-100 p-2 rounded-full hover:bg-white/10 transition-all"
                  >
                    <FiArrowRight />
                  </button>
                </div>

                {latestVitals ? (
                  <div className="space-y-3">
                    {[
                      { label: 'Blood Pressure', value: `${latestVitals.bloodPressureSystolic}/${latestVitals.bloodPressureDiastolic}` },
                      { label: 'Heart Rate', value: `${latestVitals.heartRate} bpm` },
                      { label: 'Temperature', value: `${latestVitals.temperature}°F` },
                      { label: 'Oxygen Saturation', value: `${latestVitals.oxygenSaturation}%` },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center p-4 bg-white/10 rounded-xl border border-white/10 hover:bg-white/20 transition-all">
                        <span className="text-white/80 font-semibold">{item.label}</span>
                        <span className="text-white font-bold text-lg">{item.value}</span>
                      </div>
                    ))}
                    <p className="text-xs text-cyan-300 text-center mt-4 pt-3 border-t border-white/10">
                      Updated: {formatDateTime(latestVitals.date)}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MdFavorite size={48} className="mx-auto mb-3 text-white/40" />
                    <p className="text-white/70 mb-4">No vitals logged yet</p>
                    <button
                      onClick={() => navigate('/vitals')}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-2 rounded-lg font-semibold transition-all hover:shadow-lg"
                    >
                      Log Vitals
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Symptoms Today Card */}
            <div className="lg:col-span-1 animate-slide-in-down" style={{ animationDelay: '100ms' }}>
              <div className="glass rounded-3xl shadow-2xl p-8 h-full backdrop-blur-xl border border-white/20 hover-lift">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                      <FiAlertCircle className="text-white" size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-white">Today's Symptoms</h2>
                  </div>
                  <button
                    onClick={() => navigate('/symptoms')}
                    className="text-orange-300 hover:text-orange-100 p-2 rounded-full hover:bg-white/10 transition-all"
                  >
                    <FiArrowRight />
                  </button>
                </div>

                {todaySymptoms.length > 0 ? (
                  <div className="space-y-3">
                    {todaySymptoms.map((symptom) => (
                      <div key={symptom.id} className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl border-l-4 border-orange-500 hover:from-orange-500/30 hover:to-red-500/30 transition-all">
                        <p className="text-sm font-semibold text-white mb-1">{symptom.symptoms.join(', ')}</p>
                        <p className="text-xs text-orange-200">Severity: <span className="font-bold capitalize text-orange-100">{symptom.severity}</span></p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FiAlertCircle size={48} className="mx-auto mb-3 text-white/40" />
                    <p className="text-white/70 mb-4">No symptoms logged today</p>
                    <button
                      onClick={() => navigate('/symptoms')}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-all hover:shadow-lg"
                    >
                      Log Symptoms
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Appointments Card */}
            <div className="lg:col-span-1 animate-slide-in-right" style={{ animationDelay: '200ms' }}>
              <div className="glass rounded-3xl shadow-2xl p-8 h-full backdrop-blur-xl border border-white/20 hover-lift">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <FiCalendar className="text-white" size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-white">Appointments</h2>
                  </div>
                  <button
                    onClick={() => navigate('/appointments')}
                    className="text-purple-300 hover:text-purple-100 p-2 rounded-full hover:bg-white/10 transition-all"
                  >
                    <FiArrowRight />
                  </button>
                </div>

                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingAppointments.slice(0, 3).map((apt) => (
                      <div key={apt.id} className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border-l-4 border-purple-500 hover:from-purple-500/30 hover:to-pink-500/30 transition-all">
                        <p className="text-sm font-semibold text-white">Dr. {apt.doctorName}</p>
                        <p className="text-xs text-purple-200 mt-1">{apt.date} at {apt.time}</p>
                        <p className="text-xs text-purple-100 mt-1 opacity-80">{apt.hospital}</p>
                      </div>
                    ))}
                    {upcomingAppointments.length > 3 && (
                      <p className="text-xs text-purple-300 text-center pt-3 border-t border-white/10">
                        +{upcomingAppointments.length - 3} more appointments
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MdLocalHospital size={48} className="mx-auto mb-3 text-white/40" />
                    <p className="text-white/70 mb-4">No upcoming appointments</p>
                    <button
                      onClick={() => navigate('/appointments')}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-semibold transition-all hover:shadow-lg"
                    >
                      Book Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Secondary Row - Feature Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* AI Nurse Chat Card */}
            <div className="glass rounded-3xl shadow-2xl p-8 backdrop-blur-xl border border-white/20 hover-lift animate-slide-in-left" style={{ animationDelay: '300ms' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full flex items-center justify-center">
                    <FiMessageCircle className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">AI Nurse</h2>
                    <p className="text-cyan-200 text-sm">24/7 Health Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/nurse')}
                  className="text-cyan-300 hover:text-cyan-100 p-2 rounded-full hover:bg-white/10 transition-all"
                >
                  <FiArrowRight />
                </button>
              </div>

              <p className="text-white/80 text-sm mb-6">Chat with your AI Nurse for health advice, symptom guidance, and wellness tips powered by Gemini AI.</p>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-sm text-cyan-200">{todayChat.length} messages today</span>
                <button
                  onClick={() => navigate('/nurse')}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all hover:shadow-lg"
                >
                  <FiMessageCircle size={16} /> Chat Now
                </button>
              </div>
            </div>

            {/* Diet Plans Card */}
            <div className="glass rounded-3xl shadow-2xl p-8 backdrop-blur-xl border border-white/20 hover-lift animate-slide-in-right" style={{ animationDelay: '400ms' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                    <FiClock className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Diet & Nutrition</h2>
                    <p className="text-green-200 text-sm">Personalized Plans</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/diet')}
                  className="text-green-300 hover:text-green-100 p-2 rounded-full hover:bg-white/10 transition-all"
                >
                  <FiArrowRight />
                </button>
              </div>

              <p className="text-white/80 text-sm mb-6">Get personalized meal plans based on your health conditions and dietary preferences.</p>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-sm text-green-200">{dietRecommendations.length} meal plans</span>
                <button
                  onClick={() => navigate('/diet')}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold transition-all hover:shadow-lg"
                >
                  Create Plan
                </button>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl shadow-2xl p-12 text-white text-center overflow-hidden relative animate-slide-in-down" style={{ animationDelay: '500ms' }}>
            <div className="absolute inset-0 bg-white opacity-5"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
                <MdHealthAndSafety size={48} className="animate-glow-pulse" />
              </div>
              <h2 className="text-3xl font-bold mb-3">Stay Healthy, Stay Informed</h2>
              <p className="mb-8 text-white/90 max-w-2xl mx-auto text-lg">
                Regularly log your vitals and symptoms to get better health insights and personalized recommendations from your AI Nurse.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => navigate('/vitals')}
                  className="bg-white hover:bg-gray-100 text-blue-600 font-bold px-8 py-3 rounded-xl transition-all hover:shadow-lg hover:scale-105 transform"
                >
                  Log Vitals Today
                </button>
                <button
                  onClick={() => navigate('/nurse')}
                  className="bg-white/20 hover:bg-white/30 text-white font-bold px-8 py-3 rounded-xl border border-white/30 transition-all hover:shadow-lg"
                >
                  Talk to AI Nurse
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
