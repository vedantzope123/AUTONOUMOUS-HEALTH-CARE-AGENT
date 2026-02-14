import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { FiEye, FiEyeOff, FiArrowRight, FiAward } from 'react-icons/fi';
import { MdHealthAndSafety, MdVerifiedUser } from 'react-icons/md';

export const LandingPage: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setApiKey: saveApiKey, isConfigured } = useAppContext();

  // Check for environment variable API key
  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;

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
      saveApiKey(apiKey);
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      setError('Failed to configure API key. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipWithEnvKey = () => {
    if (envApiKey) {
      setIsLoading(true);
      saveApiKey(envApiKey);
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    }
  };

  if (isConfigured) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-cyan-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Floating Background Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="animate-float1 absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="animate-float2 absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="animate-float3 absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Animated Header */}
        <div className="text-center mb-10 animate-slide-in-down">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse-glow">
              <MdHealthAndSafety size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mb-3">
            AuraHealth
          </h1>
          <p className="text-cyan-200 text-xl font-semibold mb-2">Your AI Healthcare Assistant</p>
          <p className="text-blue-300 text-sm">Powered by Gemini AI Flash</p>
        </div>

        {/* Main Card - Glass Morphism */}
        <div className="glass rounded-3xl backdrop-blur-xl border border-white/20 p-10 shadow-2xl animate-slide-in-up">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Get Started</h2>
            <p className="text-white/80">
              Enter your Gemini API key to unlock your personal AI Nurse and health management tools.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Environment API Key Notice */}
            {envApiKey && (
              <div className="p-4 bg-green-500/20 border border-green-400/50 backdrop-blur-sm rounded-xl text-green-100 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <MdVerifiedUser className="text-green-300" size={20} />
                  <span className="font-bold">API Key Configured</span>
                </div>
                <p className="text-xs text-green-200">
                  An API key is already configured via environment variables (Vercel). You can use it directly or enter your own below.
                </p>
              </div>
            )}

            {/* API Key Input */}
            <div>
              <label htmlFor="apiKey" className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <MdVerifiedUser className="text-cyan-400" /> Gemini API Key {envApiKey && '(Optional)'}
              </label>
              <div className="relative group">
                <input
                  id="apiKey"
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setError('');
                  }}
                  placeholder="AIza..."
                  className="w-full px-5 py-3 pr-12 border-2 border-white/30 rounded-xl focus:outline-none focus:border-cyan-400 transition-all bg-white/10 text-white placeholder-white/50 backdrop-blur-sm group-hover:border-white/50"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-cyan-300 transition-colors"
                >
                  {showKey ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              <p className="text-xs text-cyan-200 mt-2 font-semibold">
                🔒 Your key is stored locally and never shared with servers.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/30 border border-red-400/50 backdrop-blur-sm rounded-xl text-red-100 text-sm font-semibold animate-slide-in-down">
                ⚠️ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !apiKey.trim()}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl hover:scale-105 transform"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Configuring...
                </>
              ) : (
                <>
                  Continue to Dashboard
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Use Environment Key Button */}
            {envApiKey && (
              <button
                type="button"
                onClick={handleSkipWithEnvKey}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl hover:scale-105 transform"
              >
                Use Configured API Key
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </form>

          {/* Help Section */}
          <div className="mt-8 p-4 bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm rounded-xl">
            <h3 className="font-bold text-cyan-100 mb-3 text-sm flex items-center gap-2">
              <FiAward size={16} /> How to get your API key?
            </h3>
            <ol className="text-xs text-blue-100 space-y-2">
              <li className="flex gap-2">
                <span className="text-cyan-300 font-bold">1</span>
                <span>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline font-bold hover:text-cyan-200">Google AI Studio</a></span>
              </li>
              <li className="flex gap-2">
                <span className="text-cyan-300 font-bold">2</span>
                <span>Click "Create API Key"</span>
              </li>
              <li className="flex gap-2">
                <span className="text-cyan-300 font-bold">3</span>
                <span>Copy and paste your key above</span>
              </li>
            </ol>
          </div>

          {/* Free Tier Warning */}
          <div className="mt-4 p-4 bg-orange-500/20 border border-orange-400/30 backdrop-blur-sm rounded-xl">
            <h3 className="font-bold text-orange-100 text-sm mb-2 flex items-center gap-2">
              ⚠️ Free Tier Limits
            </h3>
            <p className="text-xs text-orange-100">
              Max 60 requests/minute. If you hit the limit, wait a moment or <a href="https://ai.google.dev/pricing" target="_blank" rel="noopener noreferrer" className="text-yellow-300 underline font-bold hover:text-yellow-200">upgrade your plan</a>
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-10 grid grid-cols-3 gap-4">
          <div className="glass rounded-2xl backdrop-blur-xl border border-white/20 p-6 text-center hover:border-cyan-400/50 transition-all hover:bg-white/10 hover-lift animate-slide-in-left" style={{ animationDelay: '100ms' }}>
            <div className="text-4xl mb-2 flex justify-center">🤖</div>
            <p className="text-xs text-white/80 font-semibold">AI Nurse Chat</p>
          </div>
          <div className="glass rounded-2xl backdrop-blur-xl border border-white/20 p-6 text-center hover:border-blue-400/50 transition-all hover:bg-white/10 hover-lift animate-slide-in-down" style={{ animationDelay: '200ms' }}>
            <div className="text-4xl mb-2 flex justify-center">💊</div>
            <p className="text-xs text-white/80 font-semibold">Health Tracking</p>
          </div>
          <div className="glass rounded-2xl backdrop-blur-xl border border-white/20 p-6 text-center hover:border-purple-400/50 transition-all hover:bg-white/10 hover-lift animate-slide-in-right" style={{ animationDelay: '300ms' }}>
            <div className="text-4xl mb-2 flex justify-center">🔒</div>
            <p className="text-xs text-white/80 font-semibold">Secure & Private</p>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-cyan-300 mt-8 px-4">
          AuraHealth is for informational purposes only. Not a substitute for professional medical advice. Always consult healthcare professionals.
        </p>
      </div>
    </div>
  );
};


