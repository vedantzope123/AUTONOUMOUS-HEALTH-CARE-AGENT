import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FiEye, FiEyeOff, FiSave, FiRotateCcw, FiMoon, FiSun } from 'react-icons/fi';
import { MdSettings, MdVerifiedUser } from 'react-icons/md';

export const Settings: React.FC = () => {
  const { apiKey, setApiKey, voiceSettings, updateVoiceSettings, theme, setTheme } = useAppContext();
  const [tempApiKey, setTempApiKey] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      setApiKey(tempApiKey);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleResetApiKey = () => {
    setTempApiKey('');
    setApiKey('');
  };

  const handleLanguageChange = (language: 'en-US' | 'hi-IN') => {
    updateVoiceSettings({
      ...voiceSettings,
      speechLanguage: language,
      voiceLanguage: language,
    });
  };

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
  };

  return (
    <div className="md:ml-64 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 relative overflow-hidden p-4 md:p-8">
      {/* Floating Background Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="animate-float1 absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="animate-float2 absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="animate-float3 absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 animate-slide-in-down">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-lg animate-pulse-glow">
              <MdSettings size={28} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-300 via-red-300 to-pink-300 bg-clip-text text-transparent">
              Settings & Configuration
            </h1>
          </div>
          <p className="text-red-200 text-lg ml-16">Customize your AuraHealth experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* API Key Configuration */}
          <div className="glass rounded-3xl shadow-2xl p-8 backdrop-blur-xl border border-white/20 hover-lift animate-slide-in-left">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <MdVerifiedUser className="text-orange-400" size={28} /> API Key Setup
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white/90 mb-3">
                  🔑 Gemini API Key
                </label>
                <div className="relative group">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder="AIza..."
                    className="w-full px-5 py-3 pr-12 border-2 border-white/30 rounded-xl focus:outline-none focus:border-orange-400 transition-all bg-white/10 text-white placeholder-white/50 backdrop-blur-sm group-hover:border-white/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-orange-300 transition-colors"
                  >
                    {showKey ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-orange-200 mt-2 font-semibold">
                  💾 Stored locally in your browser
                </p>
              </div>

              {/* Save Status */}
              {saved && (
                <div className="p-3 bg-green-500/30 border border-green-400/50 backdrop-blur-sm rounded-lg text-green-100 text-sm font-semibold animate-slide-in-down">
                  ✅ API Key saved successfully!
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSaveApiKey}
                  disabled={!tempApiKey.trim()}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <FiSave size={20} /> Save Key
                </button>
                <button
                  onClick={handleResetApiKey}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 font-bold py-3 rounded-lg transition-all border border-red-400/30 flex items-center justify-center gap-2"
                >
                  <FiRotateCcw size={20} /> Reset
                </button>
              </div>

              {/* Info */}
              <div className="p-4 bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm rounded-lg">
                <h4 className="font-bold text-cyan-100 mb-2 text-sm flex items-center gap-2">
                  ℹ️ Get Your API Key
                </h4>
                <ol className="text-xs text-blue-100 space-y-1">
                  <li>• Visit <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline font-bold">Google AI Studio</a></li>
                  <li>• Click "Create API Key"</li>
                  <li>• Copy and paste above</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Theme & Preferences */}
          <div className="glass rounded-3xl shadow-2xl p-8 backdrop-blur-xl border border-white/20 hover-lift animate-slide-in-right">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              🎨 Theme & Appearance
            </h2>

            <div className="space-y-6">
              {/* Theme Toggle */}
              <div>
                <label className="block text-sm font-semibold text-white/90 mb-4">
                  Select Theme
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      theme === 'dark'
                        ? 'bg-blue-500/30 border-blue-400 shadow-lg'
                        : 'bg-white/10 border-white/20 hover:border-white/40'
                    }`}
                  >
                    <FiMoon className="text-3xl mb-2 mx-auto" />
                    <p className="text-white font-semibold text-sm">Dark</p>
                    <p className="text-white/60 text-xs">Reduces eye strain</p>
                  </button>
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      theme === 'light'
                        ? 'bg-yellow-500/30 border-yellow-400 shadow-lg'
                        : 'bg-white/10 border-white/20 hover:border-white/40'
                    }`}
                  >
                    <FiSun className="text-3xl mb-2 mx-auto text-yellow-300" />
                    <p className="text-white font-semibold text-sm">Light</p>
                    <p className="text-white/60 text-xs">Bright interface</p>
                  </button>
                </div>
              </div>

              {/* Voice Settings */}
              <div className="p-4 bg-cyan-500/20 border border-cyan-400/30 backdrop-blur-sm rounded-lg">
                <h4 className="font-bold text-cyan-100 mb-4 flex items-center gap-2">
                  🎤 Voice Assistant
                </h4>
                <p className="text-white/80 text-sm mb-3">Current Language: <span className="font-semibold text-cyan-300">{voiceSettings.voiceLanguage === 'en-US' ? 'English (US)' : 'Hindi'}</span></p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleLanguageChange('en-US')}
                    className={`p-3 rounded-lg border-2 transition-all font-semibold ${
                      voiceSettings.voiceLanguage === 'en-US'
                        ? 'bg-green-500/30 border-green-400 text-green-100'
                        : 'bg-gray-500/30 border-gray-400 text-gray-100'
                    }`}
                  >
                    🇺🇸 English
                  </button>
                  <button
                    onClick={() => handleLanguageChange('hi-IN')}
                    className={`p-3 rounded-lg border-2 transition-all font-semibold ${
                      voiceSettings.voiceLanguage === 'hi-IN'
                        ? 'bg-green-500/30 border-green-400 text-green-100'
                        : 'bg-gray-500/30 border-gray-400 text-gray-100'
                    }`}
                  >
                    🇮🇳 हिंदी
                  </button>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="p-4 bg-purple-500/20 border border-purple-400/30 backdrop-blur-sm rounded-lg">
                <h4 className="font-bold text-purple-100 mb-3 flex items-center gap-2">
                  🔔 Notifications
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                      Appointment Reminders
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                      Health Alerts
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                      Daily Tips
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* App Information */}
        <div className="mt-10 glass rounded-3xl shadow-2xl p-8 backdrop-blur-xl border border-white/20 hover-lift animate-slide-in-down">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            📱 App Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
              <p className="text-white/60 text-sm mb-2">App Name</p>
              <p className="text-white font-bold text-lg">AuraHealth</p>
            </div>
            <div className="p-4 bg-cyan-500/20 rounded-lg border border-cyan-400/30">
              <p className="text-white/60 text-sm mb-2">Version</p>
              <p className="text-white font-bold text-lg">1.0.0 (Preview)</p>
            </div>
            <div className="p-4 bg-purple-500/20 rounded-lg border border-purple-400/30">
              <p className="text-white/60 text-sm mb-2">Status</p>
              <p className="text-white font-bold text-lg">🟢 Active</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center pb-8">
          <p className="text-white/60 text-sm">
            Have questions? Visit our <a href="#" className="text-cyan-300 underline hover:text-cyan-200">Help Center</a>
          </p>
          <p className="text-white/40 text-xs mt-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};
