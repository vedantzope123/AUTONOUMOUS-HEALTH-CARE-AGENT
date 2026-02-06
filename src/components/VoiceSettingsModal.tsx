import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FiSettings, FiX, FiVolume2, FiMic } from 'react-icons/fi';
import type { SupportedLanguage } from '../services/VoiceAssistantService';

export const VoiceSettingsModal: React.FC = () => {
  const { voiceSettings, updateVoiceSettings } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { value: SupportedLanguage; label: string; flag: string }[] = [
    { value: 'en-US', label: 'English', flag: '🇺🇸' },
    { value: 'hi-IN', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
  ];

  const handleLanguageChange = (type: 'speech' | 'voice', language: SupportedLanguage) => {
    if (type === 'speech') {
      updateVoiceSettings({ speechLanguage: language });
    } else {
      updateVoiceSettings({ voiceLanguage: language });
    }
  };

  const handleRateChange = (rate: number) => {
    updateVoiceSettings({ rate });
  };

  const handlePitchChange = (pitch: number) => {
    updateVoiceSettings({ pitch });
  };

  const handleVolumeChange = (volume: number) => {
    updateVoiceSettings({ volume });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-500 text-white p-4 rounded-full shadow-lg hover:bg-primary-600 transition-all hover:shadow-xl z-40"
        title="Voice Settings"
      >
        <FiSettings className="text-2xl" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FiSettings className="text-primary-500" />
            Voice Assistant Settings
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Input Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FiMic className="text-primary-500" />
              Voice Input Language
            </label>
            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={`speech-${lang.value}`}
                  onClick={() => handleLanguageChange('speech', lang.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    voiceSettings.speechLanguage === lang.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-3xl">{lang.flag}</span>
                  <span className="font-medium text-gray-800">{lang.label}</span>
                  {voiceSettings.speechLanguage === lang.value && (
                    <span className="ml-auto text-primary-500 font-semibold">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Output Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FiVolume2 className="text-primary-500" />
              Voice Output Language
            </label>
            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={`voice-${lang.value}`}
                  onClick={() => handleLanguageChange('voice', lang.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    voiceSettings.voiceLanguage === lang.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-3xl">{lang.flag}</span>
                  <span className="font-medium text-gray-800">{lang.label}</span>
                  {voiceSettings.voiceLanguage === lang.value && (
                    <span className="ml-auto text-primary-500 font-semibold">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Speed Control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Speech Speed: {voiceSettings.rate.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={voiceSettings.rate}
              onChange={(e) => handleRateChange(parseFloat(e.target.value))}
              className="w-full accent-primary-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Slow</span>
              <span>Normal</span>
              <span>Fast</span>
            </div>
          </div>

          {/* Pitch Control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Voice Pitch: {voiceSettings.pitch.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={voiceSettings.pitch}
              onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
              className="w-full accent-primary-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low</span>
              <span>Normal</span>
              <span>High</span>
            </div>
          </div>

          {/* Volume Control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Volume: {Math.round(voiceSettings.volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={voiceSettings.volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-primary-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Mute</span>
              <span>Medium</span>
              <span>Loud</span>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              <strong>Tip:</strong> You can speak in {' '}
              {voiceSettings.speechLanguage === 'hi-IN' ? 'Hindi' : 'English'} and 
              the AI will respond in {' '}
              {voiceSettings.voiceLanguage === 'hi-IN' ? 'Hindi' : 'English'}.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
