import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Symptom } from '../types';
import { generateId, formatDate } from '../utils/helpers';
import { FiPlus, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const commonSymptoms = [
  'Headache',
  'Fever',
  'Cough',
  'Sore Throat',
  'Fatigue',
  'Nausea',
  'Dizziness',
  'Body Aches',
  'Chest Pain',
  'Shortness of Breath',
  'Stomach Pain',
  'Congestion',
  'Rash',
  'Chills',
  'Loss of Taste/Smell',
];

export const SymptomsLogger: React.FC = () => {
  const { symptoms, addSymptom } = useAppContext();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleAddCustom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom)) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom]);
      setCustomSymptom('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom');
      return;
    }

    const newSymptom: Symptom = {
      id: generateId(),
      date: formatDate(new Date()),
      symptoms: selectedSymptoms,
      severity,
      description,
      location,
    };

    addSymptom(newSymptom);

    // Reset form
    setSelectedSymptoms([]);
    setSeverity('mild');
    setDescription('');
    setLocation('');
  };

  const getSeverityColor = (sev: 'mild' | 'moderate' | 'severe') => {
    switch (sev) {
      case 'mild':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'moderate':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'severe':
        return 'bg-red-50 border-red-200 text-red-700';
    }
  };

  const getSeverityBadge = (sev: 'mild' | 'moderate' | 'severe') => {
    switch (sev) {
      case 'mild':
        return { color: 'bg-green-100 text-green-800', text: 'Mild' };
      case 'moderate':
        return { color: 'bg-yellow-100 text-yellow-800', text: 'Moderate' };
      case 'severe':
        return { color: 'bg-red-100 text-red-800', text: 'Severe' };
    }
  };

  return (
    <div className="md:ml-64 min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-900 mb-8 flex items-center gap-3">
          <FiAlertCircle size={32} className="text-orange-500" />
          Symptom Tracker
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4">
              <h2 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                <FiPlus /> Log Symptoms
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Symptom Selection */}
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-3">
                    Select Symptoms
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {commonSymptoms.map((symptom) => (
                      <label key={symptom} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedSymptoms.includes(symptom)}
                          onChange={() => toggleSymptom(symptom)}
                          className="w-4 h-4 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
                        />
                        <span className="text-primary-700">{symptom}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Custom Symptom */}
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-1">
                    Add Custom Symptom
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSymptom}
                      onChange={(e) => setCustomSymptom(e.target.value)}
                      placeholder="Other symptom..."
                      className="flex-1 px-3 py-2 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustom}
                      className="px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Selected Symptoms Display */}
                {selectedSymptoms.length > 0 && (
                  <div className="p-3 bg-primary-50 rounded-lg border border-primary-200">
                    <p className="text-xs font-semibold text-primary-900 mb-2">Selected:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedSymptoms.map((symptom) => (
                        <button
                          key={symptom}
                          type="button"
                          onClick={() => toggleSymptom(symptom)}
                          className="text-xs bg-primary-200 text-primary-800 px-2 py-1 rounded hover:bg-primary-300"
                        >
                          {symptom} ✕
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Severity */}
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-2">
                    Severity
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as 'mild' | 'moderate' | 'severe')}
                    className="w-full px-3 py-2 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-500"
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-1">
                    Location (if applicable)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Head, Chest, Stomach"
                    className="w-full px-3 py-2 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe how you're feeling..."
                    rows={3}
                    className="w-full px-3 py-2 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-500 to-cyan-500 hover:from-primary-600 hover:to-cyan-600 text-white font-bold py-3 rounded-lg transition-all"
                >
                  Log Symptoms
                </button>
              </form>
            </div>
          </div>

          {/* History Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                <FiCheckCircle size={24} className="text-green-500" />
                Symptom History
              </h2>

              {symptoms.length > 0 ? (
                <div className="space-y-4">
                  {[...symptoms].reverse().map((symptom) => {
                    const badge = getSeverityBadge(symptom.severity);
                    return (
                      <div
                        key={symptom.id}
                        className={`p-4 rounded-lg border-2 ${getSeverityColor(symptom.severity)}`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${badge.color}`}>
                                {badge.text}
                              </span>
                              <span className="text-xs text-gray-500">{symptom.date}</span>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-2">
                              {symptom.symptoms.map((sym) => (
                                <span
                                  key={sym}
                                  className="bg-opacity-20 px-2 py-1 rounded text-xs font-semibold"
                                >
                                  {sym}
                                </span>
                              ))}
                            </div>

                            {symptom.location && (
                              <p className="text-sm mb-1">
                                <span className="font-semibold">Location:</span> {symptom.location}
                              </p>
                            )}

                            {symptom.description && (
                              <p className="text-sm">{symptom.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiAlertCircle size={48} className="text-primary-300 mx-auto mb-4" />
                  <p className="text-primary-600 font-semibold">No symptoms logged yet</p>
                  <p className="text-primary-500 text-sm">Start tracking your symptoms to build a health profile</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
