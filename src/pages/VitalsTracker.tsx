import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { HealthVitals } from '../types';
import { generateId, formatDate } from '../utils/helpers';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiPlus, FiTrendingUp } from 'react-icons/fi';
import { MdFavorite } from 'react-icons/md';
export const VitalsTracker: React.FC = () => {
  const { vitals, addVitals } = useAppContext();
  const [formData, setFormData] = useState({
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    temperature: '',
    bloodSugar: '',
    oxygenSaturation: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newVital: HealthVitals = {
      id: generateId(),
      date: formatDate(new Date()),
      bloodPressureSystolic: Number(formData.bloodPressureSystolic) || 0,
      bloodPressureDiastolic: Number(formData.bloodPressureDiastolic) || 0,
      heartRate: Number(formData.heartRate) || 0,
      temperature: Number(formData.temperature) || 0,
      bloodSugar: Number(formData.bloodSugar) || 0,
      oxygenSaturation: Number(formData.oxygenSaturation) || 0,
    };

    addVitals(newVital);

    setFormData({
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      heartRate: '',
      temperature: '',
      bloodSugar: '',
      oxygenSaturation: '',
    });
  };

  const chartData = vitals.slice(-7).map((vital) => ({
    date: vital.date,
    bp: vital.bloodPressureSystolic,
    hr: vital.heartRate,
    temp: vital.temperature,
    sugar: vital.bloodSugar,
    o2: vital.oxygenSaturation,
  }));

  const latestVitals = vitals.length > 0 ? vitals[vitals.length - 1] : null;

  return (
    <div className="md:ml-64 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 relative overflow-hidden p-4 md:p-8">
      {/* Floating Background Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="animate-float1 absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="animate-float2 absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="animate-float3 absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 animate-slide-in-down">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg animate-pulse-glow">
              <FiTrendingUp size={28} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent">
              Vitals Monitor
            </h1>
          </div>
          <p className="text-cyan-200 text-lg ml-16">Track and analyze your health metrics in real-time</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Column */}
          <div className="lg:col-span-1 animate-slide-in-left">
            <div className="glass rounded-3xl shadow-2xl p-8 backdrop-blur-xl border border-white/20 sticky top-8 hover-lift">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FiPlus className="text-cyan-400" size={24} /> Log Vitals
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  { label: 'Blood Pressure Sys (mmHg)', name: 'bloodPressureSystolic', placeholder: '120' },
                  { label: 'Blood Pressure Dia (mmHg)', name: 'bloodPressureDiastolic', placeholder: '80' },
                  { label: 'Heart Rate (bpm)', name: 'heartRate', placeholder: '72' },
                  { label: 'Temperature (°F)', name: 'temperature', placeholder: '98.6' },
                  { label: 'Blood Sugar (mg/dL)', name: 'bloodSugar', placeholder: '100' },
                  { label: 'Oxygen Saturation (%)', name: 'oxygenSaturation', placeholder: '98' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold text-white/90 mb-2">{field.label}</label>
                    <input
                      type="number"
                      name={field.name}
                      value={(formData as any)[field.name]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2 border-2 border-white/20 rounded-lg focus:outline-none focus:border-cyan-400 transition-all bg-white/10 text-white placeholder-white/40 backdrop-blur-sm"
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 rounded-lg transition-all hover:shadow-lg hover:scale-105 transform flex items-center justify-center gap-2"
                >
                  <FiPlus size={20} /> Log Reading
                </button>
              </form>

              {/* Latest Vitals Card */}
              {latestVitals && (
                <div className="mt-6 p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg border border-white/20 backdrop-blur-sm">
                  <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                    <MdFavorite className="animate-heartbeat text-red-400" /> Latest Reading
                  </h3>
                  <div className="space-y-2 text-sm">
                    {[
                      { key: 'BP', value: `${latestVitals.bloodPressureSystolic}/${latestVitals.bloodPressureDiastolic}` },
                      { key: 'HR', value: `${latestVitals.heartRate} bpm` },
                      { key: 'Temp', value: `${latestVitals.temperature}°F` },
                      { key: 'O₂', value: `${latestVitals.oxygenSaturation}%` },
                    ].map((item) => (
                      <p key={item.key} className="text-white/80">
                        <span className="font-semibold text-cyan-300">{item.key}:</span> {item.value}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Charts Column */}
          <div className="lg:col-span-2 space-y-6 animate-slide-in-right">
            {/* Health Status Cards */}
            {latestVitals && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Systolic BP', value: `${latestVitals.bloodPressureSystolic}`, icon: '🩺', color: 'from-blue-500 to-cyan-500' },
                  { label: 'Heart Rate', value: `${latestVitals.heartRate}`, icon: '❤️', color: 'from-red-500 to-pink-500' },
                  { label: 'Temperature', value: `${latestVitals.temperature}°F`, icon: '🌡️', color: 'from-orange-500 to-red-500' },
                  { label: 'Blood Sugar', value: `${latestVitals.bloodSugar}`, icon: '📊', color: 'from-green-500 to-emerald-500' },
                  { label: 'O₂ Level', value: `${latestVitals.oxygenSaturation}%`, icon: '💨', color: 'from-purple-500 to-pink-500' },
                ].map((stat, idx) => (
                  <div
                    key={stat.label}
                    className={`glass rounded-2xl backdrop-blur-xl border border-white/20 p-4 bg-gradient-to-br ${stat.color} hover:border-white/40 transition-all hover-lift animate-slide-in-up`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <p className="text-white/70 text-xs font-semibold mb-1">{stat.label}</p>
                    <p className="text-white font-bold text-lg">{stat.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Charts */}
            {chartData.length > 0 ? (
              <div className="space-y-6">
                {/* Line Chart */}
                <div className="glass rounded-3xl backdrop-blur-xl border border-white/20 p-6 hover-lift animate-slide-in-down">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    📈 Heart Rate Trend (Last 7 Days)
                  </h3>
                  <div className="bg-white/5 rounded-xl p-4">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                        <YAxis stroke="rgba(255,255,255,0.5)" />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.2)' }} />
                        <Legend />
                        <Line type="monotone" dataKey="hr" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4' }} name="Heart Rate" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="glass rounded-3xl backdrop-blur-xl border border-white/20 p-6 hover-lift animate-slide-in-up">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    📊 Vitals Overview
                  </h3>
                  <div className="bg-white/5 rounded-xl p-4">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                        <YAxis stroke="rgba(255,255,255,0.5)" />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.2)' }} />
                        <Legend />
                        <Bar dataKey="bp" fill="#3b82f6" name="Systolic BP" />
                        <Bar dataKey="o2" fill="#10b981" name="O₂ Level" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass rounded-3xl backdrop-blur-xl border border-white/20 p-12 text-center hover-lift animate-slide-in-down">
                <div className="text-5xl mb-4">📊</div>
                <p className="text-white/80 text-lg font-semibold mb-2">No data yet</p>
                <p className="text-white/60">Log your vitals to see trends and analytics</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
