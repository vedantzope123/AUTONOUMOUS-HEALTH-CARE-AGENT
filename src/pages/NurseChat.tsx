import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { GeminiNurseService, initializeNurseService } from '../services/GeminiNurseService';
import { formatDateTime, generateId } from '../utils/helpers';
import {
  FiSend,
  FiAlertTriangle,
  FiPhoneCall,
  FiMessageSquare,
  FiRefreshCw,
  FiDownload,
} from 'react-icons/fi';
import { MdHealthAndSafety } from 'react-icons/md';
import { VoiceControls, SpeakButton } from '../components/VoiceControls';
import { getVoiceAssistant } from '../services/VoiceAssistantService';

export const NurseChat: React.FC = () => {
  const { apiKey, chatHistory, addChatMessage, setIsLoading, voiceSettings } =
    useAppContext();

  const [inputValue, setInputValue] = useState('');
  const [nurseService, setNurseService] = useState<GeminiNurseService | null>(null);
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isCritical, setIsCritical] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [voiceAssistant] = useState(() => getVoiceAssistant(voiceSettings));

  // Initialize Gemini service
  useEffect(() => {
    if (apiKey) {
      const lang = voiceSettings.voiceLanguage.split('-')[0] as 'en' | 'hi';
      const service = initializeNurseService(apiKey, lang);
      setNurseService(service);
    }
  }, [apiKey, voiceSettings.voiceLanguage]);

  // Update voice assistant settings
  useEffect(() => {
    voiceAssistant.updateSettings(voiceSettings);
  }, [voiceSettings, voiceAssistant]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) {
      setLocalError('Please enter a message');
      return;
    }

    if (!nurseService) {
      setLocalError('Nurse service not initialized. Please check your API key.');
      setTimeout(() => setLocalError(null), 5000);
      return;
    }

    if (localIsLoading) {
      return;
    }

    const userMessage = inputValue.trim();
    setInputValue('');

    // Add user message to chat
    const userChatMessage = {
      id: generateId(),
      role: 'user' as const,
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userChatMessage);

    setLocalIsLoading(true);
    setIsLoading(true);

    try {
      const lang = voiceSettings.voiceLanguage.split('-')[0] as 'en' | 'hi';
      const response = await nurseService.askNurse(userMessage, lang);

      // Add nurse response to chat
      const nurseChatMessage = {
        id: generateId(),
        role: 'nurse' as const,
        content: response.message,
        timestamp: new Date().toISOString(),
        isCritical: response.isCritical,
        criticalAlert: response.criticalAlert,
      };
      addChatMessage(nurseChatMessage);

      if (response.isCritical) {
        setIsCritical(true);
      }

      // Auto-speak nurse response
      if (voiceAssistant.isSupported()) {
        try {
          await voiceAssistant.speak(response.message);
        } catch (err) {
          console.error('Failed to speak response:', err);
        }
      }

      setLocalError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to get nurse response';
      setLocalError(errorMsg);

      const errorMessage = {
        id: generateId(),
        role: 'nurse' as const,
        content: `I apologize, but I encountered an error: ${errorMsg}. Please check your API key and try again.`,
        timestamp: new Date().toISOString(),
      };
      addChatMessage(errorMessage);

      // Clear error after 8 seconds
      setTimeout(() => setLocalError(null), 8000);
    } finally {
      setLocalIsLoading(false);
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (nurseService) {
      nurseService.resetConversation();
    }
    setIsCritical(false);
  };

  const handleVoiceInput = (text: string) => {
    setInputValue(text);
  };

  const downloadChat = () => {
    const chatText = chatHistory
      .map(
        (msg) =>
          `[${formatDateTime(msg.timestamp)}] ${msg.role === 'user' ? 'You' : 'Nurse'}: ${msg.content}`
      )
      .join('\n\n');

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(chatText)}`);
    element.setAttribute('download', `nurse-chat-${new Date().toISOString().split('T')[0]}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="md:ml-64 min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              <MdHealthAndSafety size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-900">AI Nurse Assistant</h1>
              <p className="text-primary-600 text-sm">Powered by Gemini 3 Flash Preview - Your 24/7 Health Companion</p>
            </div>
          </div>

          {/* Critical Alert */}
          {isCritical && (
            <div className="bg-red-50 border-2 border-red-400 p-4 rounded-lg flex items-start gap-3">
              <FiAlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={20} />
              <div className="flex-1">
                <p className="font-bold text-red-900">⚠️ CRITICAL ALERT</p>
                <p className="text-red-800 text-sm mt-1">
                  If this is a life-threatening emergency, please call emergency services (911) immediately.
                </p>
                <button className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                  <FiPhoneCall /> Call Emergency
                </button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {localError && (
            <div className="bg-orange-50 border-2 border-orange-300 p-4 rounded-lg flex items-start gap-3">
              <FiAlertTriangle className="text-orange-600 flex-shrink-0 mt-1" size={20} />
              <div className="flex-1">
                <p className="font-bold text-orange-900">⚠️ Error</p>
                <p className="text-orange-800 text-sm mt-1">{localError}</p>
                {localError.includes('quota') || localError.includes('Quota') ? (
                  <p className="text-orange-700 text-xs mt-2">
                    💡 <strong>Tip:</strong> The free tier has limited requests. Please wait a moment before trying again, or{' '}
                    <a 
                      href="https://ai.google.dev/pricing" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline font-semibold"
                    >
                      upgrade your API key
                    </a> for higher limits.
                  </p>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[600px] md:h-[70vh]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-primary-50 to-white">
            {chatHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <FiMessageSquare size={48} className="text-primary-300 mb-4" />
                <p className="text-primary-600 font-semibold mb-2">Start Your Conversation</p>
                <p className="text-primary-500 text-sm max-w-md">
                  Tell me about your symptoms, ask health questions, or share your concerns. I'm here to help!
                </p>
              </div>
            ) : (
              chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={`animate-slide-in ${
                    message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary-500 text-white rounded-br-none'
                        : 'bg-primary-100 text-primary-900 rounded-bl-none'
                    }`}
                  >
                    {message.isCritical && (
                      <div className="flex items-center gap-1 mb-2 text-red-600 font-bold text-sm">
                        <FiAlertTriangle size={16} /> CRITICAL
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm whitespace-pre-wrap break-words flex-1">{message.content}</p>
                      {message.role === 'nurse' && (
                        <SpeakButton text={message.content} iconClassName="text-lg" />
                      )}
                    </div>
                    <p
                      className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-primary-200' : 'text-primary-600'
                      }`}
                    >
                      {formatDateTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
            {localIsLoading && (
              <div className="flex justify-start">
                <div className="bg-primary-100 text-primary-900 px-4 py-3 rounded-lg rounded-bl-none">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-primary-200 bg-white p-4">
            {/* Action Buttons */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={downloadChat}
                disabled={chatHistory.length === 0}
                className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm disabled:opacity-50 transition-colors"
              >
                <FiDownload size={16} /> Export
              </button>
              <button
                onClick={handleClearChat}
                className="flex items-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm transition-colors"
              >
                <FiRefreshCw size={16} /> Clear
              </button>
            </div>

            {/* Input Form */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Describe your symptoms or ask a health question..."
                className="flex-1 px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
                disabled={localIsLoading}
              />
              <VoiceControls
                onVoiceInput={handleVoiceInput}
                disabled={localIsLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || localIsLoading}
                className="bg-gradient-to-r from-primary-500 to-cyan-500 hover:from-primary-600 hover:to-cyan-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-all font-semibold flex items-center gap-2"
              >
                <FiSend /> Send
              </button>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-primary-600 mt-2">
              💡 This AI Nurse is for informational purposes only and not a replacement for professional medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
