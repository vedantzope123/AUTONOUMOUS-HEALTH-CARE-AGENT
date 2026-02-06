import React, { useState, useEffect } from 'react';
import { FiMic, FiMicOff, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';
import { getVoiceAssistant } from '../services/VoiceAssistantService';

interface VoiceControlsProps {
  onVoiceInput?: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  onVoiceInput,
  disabled = false,
  className = '',
}) => {
  const { voiceSettings } = useAppContext();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voiceAssistant] = useState(() => getVoiceAssistant(voiceSettings));

  useEffect(() => {
    voiceAssistant.updateSettings(voiceSettings);
  }, [voiceSettings, voiceAssistant]);

  const handleVoiceInput = async () => {
    if (disabled || isListening) return;

    try {
      setError(null);
      setIsListening(true);
      const transcript = await voiceAssistant.startListening();
      setIsListening(false);
      
      if (onVoiceInput && transcript) {
        onVoiceInput(transcript);
      }
    } catch (err) {
      setIsListening(false);
      const errorMessage = err instanceof Error ? err.message : 'Voice input failed';
      setError(errorMessage);
      setTimeout(() => setError(null), 3000);
    }
  };

  const stopListening = () => {
    voiceAssistant.stopListening();
    setIsListening(false);
  };

  const stopSpeaking = () => {
    voiceAssistant.stopSpeaking();
    setIsSpeaking(false);
  };

  useEffect(() => {
    // Check if speaking status changes
    const checkSpeakingStatus = setInterval(() => {
      setIsSpeaking(voiceAssistant.isSpeaking());
    }, 100);

    return () => clearInterval(checkSpeakingStatus);
  }, [voiceAssistant]);

  if (!voiceAssistant.isSupported()) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Voice Input Button */}
      <div className="relative">
        <button
          onClick={isListening ? stopListening : handleVoiceInput}
          disabled={disabled}
          className={`p-3 rounded-full transition-all ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
              : disabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-lg'
          }`}
          title={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? (
            <FiMicOff className="text-xl" />
          ) : (
            <FiMic className="text-xl" />
          )}
        </button>
        {isListening && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </div>

      {/* Stop Speaking Button */}
      {isSpeaking && (
        <button
          onClick={stopSpeaking}
          className="p-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-md hover:shadow-lg animate-pulse"
          title="Stop speaking"
        >
          <FiVolumeX className="text-xl" />
        </button>
      )}

      {/* Error Toast */}
      {error && (
        <div className="absolute top-full mt-2 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-sm shadow-lg z-10">
          {error}
        </div>
      )}
    </div>
  );
};

// Helper component for speak button
interface SpeakButtonProps {
  text: string;
  className?: string;
  iconClassName?: string;
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({
  text,
  className = '',
  iconClassName = '',
}) => {
  const { voiceSettings } = useAppContext();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceAssistant] = useState(() => getVoiceAssistant(voiceSettings));

  useEffect(() => {
    voiceAssistant.updateSettings(voiceSettings);
  }, [voiceSettings, voiceAssistant]);

  const handleSpeak = async () => {
    if (isSpeaking) {
      voiceAssistant.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    try {
      setIsSpeaking(true);
      await voiceAssistant.speak(text);
      setIsSpeaking(false);
    } catch (err) {
      setIsSpeaking(false);
      console.error('Speech error:', err);
    }
  };

  if (!voiceAssistant.isSupported()) {
    return null;
  }

  return (
    <button
      onClick={handleSpeak}
      className={`transition-all ${
        isSpeaking ? 'text-orange-500 animate-pulse' : 'text-gray-600 hover:text-primary-500'
      } ${className}`}
      title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
    >
      {isSpeaking ? (
        <FiVolumeX className={iconClassName || 'text-xl'} />
      ) : (
        <FiVolume2 className={iconClassName || 'text-xl'} />
      )}
    </button>
  );
};
