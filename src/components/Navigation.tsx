import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { FiHome, FiMessageCircle, FiActivity, FiCalendar, FiLogOut, FiMenu, FiX, FiMap, FiFileText } from 'react-icons/fi';
import { MdHealthAndSafety } from 'react-icons/md';
import { useState } from 'react';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setApiKey, isConfigured } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    setApiKey('');
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/nurse', label: 'AI Nurse', icon: FiMessageCircle },
    { path: '/vitals', label: 'Vitals', icon: FiActivity },
    { path: '/symptoms', label: 'Symptoms', icon: MdHealthAndSafety },
    { path: '/appointments', label: 'Appointments', icon: FiCalendar },
    { path: '/diet', label: 'Diet Plans', icon: FiActivity },
    { path: '/report', label: 'Reports', icon: FiHome },
    { path: '/hospitals', label: 'Hospitals', icon: FiMap },
    { path: '/receipt', label: 'Receipt Analyzer', icon: FiFileText },
  ];

  if (!isConfigured) {
    return null;
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed md:hidden top-4 right-4 z-50 bg-primary-500 text-white p-2 rounded-full"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Navigation Sidebar */}
      <nav
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-primary-600 to-primary-700 text-white shadow-xl transform transition-transform md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-40`}
      >
        <div className="p-6 border-b border-primary-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <MdHealthAndSafety size={24} className="text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AuraHealth</h1>
              <p className="text-xs text-primary-100">Medicare</p>
            </div>
          </div>
        </div>

        <ul className="p-4 space-y-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <button
                onClick={() => {
                  navigate(path);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(path)
                    ? 'bg-white text-primary-600 font-semibold shadow-lg'
                    : 'text-primary-100 hover:bg-primary-500 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
