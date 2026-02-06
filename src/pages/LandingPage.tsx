import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { MdHealthAndSafety } from 'react-icons/md';

export const LandingPage: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setApiKey: saveApiKey, isConfigured } = useAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!apiKey.trim()) {
      setError('Please enter your Gemini API key');
      return;
    }

    if (apiKey.length < 20) {
      setError('API key seems too short. Please verify it\'s correct.');
      return;
    }

    setIsLoading(true);
    try {
      // Save the API key
      saveApiKey(apiKey);

      // Navigate to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      setError('Failed to configure API key. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If already configured, redirect to dashboard
  if (isConfigured) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              <MdHealthAndSafety size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-primary-900 mb-2">AuraHealth</h1>
          <p className="text-primary-600 text-lg font-semibold">Medicare Assistant</p>
          <p className="text-primary-500 text-sm mt-2">Powered by Gemini 3 Flash Preview</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-primary-100">
          <h2 className="text-2xl font-bold text-primary-900 mb-2">Get Started</h2>
          <p className="text-primary-600 mb-6">
            Enter your Gemini API key to access your personal AI Nurse and health management tools.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* API Key Input */}
            <div>
              <label htmlFor="apiKey" className="block text-sm font-semibold text-primary-900 mb-2">
                Gemini API Key (Gemini 3 Flash Preview)
              </label>
              <div className="relative">
                <input
                  id="apiKey"
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setError('');
                  }}
                  placeholder="sk-..."
                  className="w-full px-4 py-3 pr-12 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-500 transition-colors bg-primary-50"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-500 hover:text-primary-700"
                >
                  {showKey ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              <p className="text-xs text-primary-500 mt-1">
                Your key is stored securely in your browser and never sent to our servers.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !apiKey.trim()}
              className="w-full bg-gradient-to-r from-primary-500 to-cyan-500 hover:from-primary-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Configuring...
                </>
              ) : (
                <>
                  Continue to Dashboard
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Help Section */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2 text-sm">How to get your API key?</h3>
            <ol className="text-xs text-blue-800 space-y-1">
              <li>1. Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google AI Studio</a></li>
              <li>2. Click "Create API Key"</li>
              <li>3. Copy and paste your key above</li>
            </ol>
          </div>

          {/* Free Tier Warning */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-900 text-sm mb-1">⚠️ Free Tier Limits</h3>
            <p className="text-xs text-yellow-800">
              Free tier has rate limits: max 60 requests/minute and rate limited to 1 request per 3 seconds. If you hit the quota, wait a moment or <a href="https://ai.google.dev/pricing" target="_blank" rel="noopener noreferrer" className="text-yellow-700 underline font-semibold">upgrade your plan</a> for higher limits.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl mb-1">🏥</div>
            <p className="text-xs text-primary-600 font-semibold">AI Nurse</p>
          </div>
          <div>
            <div className="text-2xl mb-1">💊</div>
            <p className="text-xs text-primary-600 font-semibold">Health Tracking</p>
          </div>
          <div>
            <div className="text-2xl mb-1">🔐</div>
            <p className="text-xs text-primary-600 font-semibold">Secure & Private</p>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-primary-500 mt-6">
          AuraHealth is an AI assistant for informational purposes only and is not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
};
