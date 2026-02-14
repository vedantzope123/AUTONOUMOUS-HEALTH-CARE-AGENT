import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Appointment } from '../types';
import { generateId } from '../utils/helpers';
import { FiCalendar, FiMapPin, FiPhone, FiX } from 'react-icons/fi';
import { getHospitalLocator, type HospitalLocation } from '../services/HospitalLocatorService';

export const AppointmentsHub: React.FC = () => {
  const { appointments, addAppointment, cancelAppointment } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [nearbyHospitals, setNearbyHospitals] = useState<HospitalLocation[]>([]);
  const [loadingHospitals, setLoadingHospitals] = useState(true);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    hospital: '',
    doctorName: '',
    reason: '',
  });

  useEffect(() => {
    // Fetch nearby hospitals when component mounts
    const fetchNearbyHospitals = async () => {
      try {
        setLoadingHospitals(true);
        const locator = getHospitalLocator();
        const hospitals = await locator.getNearbyHospitals(10); // 10 km radius
        setNearbyHospitals(hospitals);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
        // Keep empty array to show no hospitals found
      } finally {
        setLoadingHospitals(false);
      }
    };

    fetchNearbyHospitals();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date || !formData.time || !formData.hospital || !formData.doctorName || !formData.reason) {
      alert('Please fill all fields');
      return;
    }

    const appointment: Appointment = {
      id: generateId(),
      date: formData.date,
      time: formData.time,
      hospital: formData.hospital,
      doctorName: formData.doctorName,
      reason: formData.reason,
      status: 'scheduled',
    };

    addAppointment(appointment);
    setFormData({
      date: '',
      time: '',
      hospital: '',
      doctorName: '',
      reason: '',
    });
    setShowForm(false);
  };

  return (
    <div className="md:ml-64 min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-900 mb-8 flex items-center gap-3">
          <FiCalendar size={32} className="text-blue-500" />
          Appointments & Hospitals
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Nearby Hospitals */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                <FiMapPin className="text-red-500" /> Nearby Hospitals
              </h2>

              {loadingHospitals ? (
                <div className="text-center py-8 text-primary-600">Loading nearby hospitals...</div>
              ) : nearbyHospitals.length > 0 ? (
                <div className="space-y-4">
                  {nearbyHospitals.slice(0, 10).map((hospital) => (
                    <div key={hospital.id} className="p-4 border-2 border-primary-200 rounded-lg hover:border-primary-500 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-primary-900 text-lg">{hospital.name}</h3>
                          <p className="text-sm text-primary-600 mt-1">{hospital.address}</p>
                          {hospital.types && hospital.types.length > 0 && (
                            <p className="text-xs text-blue-600 mt-1">
                              {hospital.types.slice(0, 2).join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          {hospital.rating && (
                            <div className="text-yellow-500 font-bold">⭐ {hospital.rating}</div>
                          )}
                          <p className="text-sm text-primary-600">{hospital.distance} km away</p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 mt-3 pt-3 border-t border-primary-100">
                        {hospital.phone && hospital.phone !== 'Not available' && (
                          <a
                            href={`tel:${hospital.phone}`}
                            className="flex items-center gap-2 text-primary-600 hover:text-primary-800 font-semibold flex-1"
                          >
                            <FiPhone size={18} /> {hospital.phone}
                          </a>
                        )}
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${hospital.latitude},${hospital.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold text-center"
                        >
                          View on Map
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-primary-600">
                  No hospitals found nearby. Please check your location permissions.
                </div>
              )}
            </div>

            {/* Scheduled Appointments */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-primary-900 mb-4">📅 Scheduled Appointments</h2>

              {appointments.filter((a) => a.status === 'scheduled').length > 0 ? (
                <div className="space-y-4">
                  {appointments
                    .filter((a) => a.status === 'scheduled')
                    .reverse()
                    .map((appointment) => (
                      <div key={appointment.id} className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-primary-900">Dr. {appointment.doctorName}</h3>
                            <p className="text-sm text-primary-600">at {appointment.hospital}</p>
                          </div>
                          <button
                            onClick={() => cancelAppointment(appointment.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <FiX size={20} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-green-200 text-sm">
                          <div>
                            <p className="text-green-700 font-semibold">{appointment.date}</p>
                            <p className="text-green-600">at {appointment.time}</p>
                          </div>
                          <div>
                            <p className="text-primary-700 font-semibold">Reason:</p>
                            <p className="text-primary-600">{appointment.reason}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-primary-600">No scheduled appointments</div>
              )}
            </div>
          </div>

          {/* Book Appointment Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4">
              <h2 className="text-xl font-bold text-primary-900 mb-4">
                {showForm ? 'Book New Appointment' : 'Schedule Visit'}
              </h2>

              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-gradient-to-r from-primary-500 to-cyan-500 hover:from-primary-600 hover:to-cyan-600 text-white font-bold py-3 rounded-lg transition-all"
                >
                  + New Appointment
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-primary-900 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-900 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-900 mb-1">
                      Hospital
                    </label>
                    <select
                      name="hospital"
                      value={formData.hospital}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-500"
                    >
                      <option value="">Select Hospital</option>
                      {nearbyHospitals.map((h) => (
                        <option key={h.id} value={h.name}>
                          {h.name} - {h.distance} km
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-900 mb-1">
                      Doctor Name
                    </label>
                    <input
                      type="text"
                      name="doctorName"
                      value={formData.doctorName}
                      onChange={handleInputChange}
                      placeholder="Doctor's name"
                      className="w-full px-3 py-2 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-900 mb-1">
                      Reason
                    </label>
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      placeholder="Reason for visit..."
                      rows={2}
                      className="w-full px-3 py-2 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-all"
                  >
                    Book Appointment
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
