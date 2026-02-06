import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { HealthVitals } from '../types';
import { generateId, formatDate } from '../utils/helpers';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiPlus, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

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

    // Reset form
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
    <div className="md:ml-64 min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-900 mb-8 flex items-center gap-3">
          <FiTrendingUp size={32} className="text-primary-500" />
          Vitals Monitor
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                <FiPlus /> Log New Reading
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-1">
                    Blood Pressure Sys (mmHg)
                  </label>
                  <input
                    type="number"
                    name="bloodPressureSystolic"
                    value={formData.bloodPressureSystolic}
                    onChange={handleInputChange}
                    placeholder="e.g., 120"
                    className="w-full px-3 py-2 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-1">
                    Blood Pressure Dia (mmHg)
                  </label>
                  <input
                    type="number"
                    name="bloodPressureDiastolic"
                    value={formData.bloodPressureDiastolic}
                    onChange={handleInputChange}
                    placeholder="e.g., 80"
                    className="w-full px-3 py-2 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-1">
                    Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    name="heartRate"
                    value={formData.heartRate}
                    onChange={handleInputChange}
                    placeholder="e.g., 72"
                    className="w-full px-3 py-2 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-1">
                    Temperature (°F)
                  </label>
                  <input
                    type="number"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    placeholder="e.g., 98.6"
                    step="0.1"
                    className="w-full px-3 py-2 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-1">
                    Blood Sugar (mg/dL)
                  </label>
                  <input
                    type="number"
                    name="bloodSugar"
                    value={formData.bloodSugar}
                    onChange={handleInputChange}
                    placeholder="e.g., 100"
                    className="w-full px-3 py-2 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-1">
                    Oxygen Saturation (%)
                  </label>
                  <input
                    type="number"
                    name="oxygenSaturation"
                    value={formData.oxygenSaturation}
                    onChange={handleInputChange}
                    placeholder="e.g., 98"
                    className="w-full px-3 py-2 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-500 to-cyan-500 hover:from-primary-600 hover:to-cyan-600 text-white font-bold py-3 rounded-lg transition-all"
                >
                  Save Reading
                </button>
              </form>

              {/* Latest Vitals */}
              {latestVitals && (
                <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
                  <h3 className="font-bold text-primary-900 mb-3">Latest Reading</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-primary-700">
                      <span className="font-semibold">BP:</span> {latestVitals.bloodPressureSystolic}/{latestVitals.bloodPressureDiastolic}
                    </p>
                    <p className="text-primary-700">
                      <span className="font-semibold">HR:</span> {latestVitals.heartRate} bpm
                    </p>
                    <p className="text-primary-700">
                      <span className="font-semibold">Temp:</span> {latestVitals.temperature}°F
                    </p>
                    <p className="text-primary-700">
                      <span className="font-semibold">Sugar:</span> {latestVitals.bloodSugar} mg/dL
                    </p>
                    <p className="text-primary-700">
                      <span className="font-semibold">O₂:</span> {latestVitals.oxygenSaturation}%
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Charts Column */}
          <div className="lg:col-span-2 space-y-4">
            {vitals.length > 0 ? (
              <>
                {/* Blood Pressure and Heart Rate */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-bold text-primary-900 mb-4">Blood Pressure & Heart Rate Trends</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="bp" stroke="#0284c7" name="Systolic BP" />
                      <Line yAxisId="right" type="monotone" dataKey="hr" stroke="#06b6d4" name="Heart Rate" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Temperature and Blood Sugar */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-bold text-primary-900 mb-4">Temperature & Blood Sugar Trends</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="temp" fill="#f43f5e" name="Temp (°F)" />
                      <Bar yAxisId="right" dataKey="sugar" fill="#8b5cf6" name="Blood Sugar (mg/dL)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Oxygen Saturation */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-bold text-primary-900 mb-4">Oxygen Saturation Trend</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="o2" stroke="#10b981" name="O₂ Saturation (%)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center col-span-2">
                <FiAlertCircle size={48} className="text-primary-300 mx-auto mb-4" />
                <p className="text-primary-600 font-semibold">No vitals recorded yet</p>
                <p className="text-primary-500 text-sm">Start logging your vitals to see charts and trends</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
