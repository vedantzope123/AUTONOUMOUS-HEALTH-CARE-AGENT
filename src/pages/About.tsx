import React, { useState } from 'react';
import { FiTarget, FiZap, FiShield, FiUsers, FiTrendingUp, FiHeart } from 'react-icons/fi';
import { MdHealthAndSafety, MdSchool, MdRocket, MdVerified } from 'react-icons/md';

export const About: React.FC = () => {
  const [expandedTab, setExpandedTab] = useState<string>('features');

  const features = [
    {
      icon: '🤖',
      title: 'AI Nurse Chat',
      description: 'Talk to your AI Nurse powered by Gemini AI',
      details: [
        '24/7 health conversation support',
        'Symptom assessment and analysis',
        'Medical advice and guidance',
        'Drug interaction checking',
        'Multi-language support (English & Hindi)',
      ],
    },
    {
      icon: '❤️',
      title: 'Vitals Tracker',
      description: 'Monitor all your health metrics',
      details: [
        'Blood pressure monitoring',
        'Heart rate tracking',
        'Temperature monitoring',
        'Blood sugar tracking',
        'Oxygen saturation monitoring',
        '7-day trend analysis',
      ],
    },
    {
      icon: '📝',
      title: 'Symptoms Logger',
      description: 'Record and track your symptoms',
      details: [
        '15+ pre-defined symptoms',
        'Custom symptom entry',
        'Severity level tracking',
        'Location-based logging',
        'Pattern analysis',
      ],
    },
    {
      icon: '📅',
      title: 'Appointments Hub',
      description: 'Manage your medical appointments',
      details: [
        'Schedule appointments easily',
        'Appointment reminders',
        'Doctor directory',
        'Hospital/clinic information',
        'Location-based search',
      ],
    },
    {
      icon: '🍎',
      title: 'Diet & Nutrition',
      description: 'Personalized meal planning',
      details: [
        'AI-generated meal plans',
        'Health condition based meals',
        'Dietary restriction support',
        'Nutrient tracking',
        'Food recommendation engine',
      ],
    },
    {
      icon: '🏥',
      title: 'Hospital Locator',
      description: 'Find nearby healthcare facilities',
      details: [
        'Real-time hospital location',
        'Distance calculation',
        'Rating and reviews',
        'Emergency services',
        'Directions integration',
      ],
    },
    {
      icon: '📄',
      title: 'Receipt Analyzer',
      description: 'Analyze medical receipts',
      details: [
        'Image-based receipt scanning',
        'Medical OCR processing',
        'Cost breakdown analysis',
        'Insurance claim assistance',
        'Receipt organization',
      ],
    },
    {
      icon: '📊',
      title: 'Health Reports',
      description: 'Comprehensive health documentation',
      details: [
        'Health summary reports',
        'Medical history tracking',
        'Lab result management',
        'Downloadable reports',
        'Doctor-shareable formats',
      ],
    },
  ];

  const technologies = [
    { name: 'React 18+', icon: '⚛️', description: 'Modern UI framework' },
    { name: 'TypeScript', icon: '📘', description: 'Type-safe development' },
    { name: 'Tailwind CSS', icon: '🎨', description: 'Utility-first styling' },
    { name: 'Gemini AI', icon: '🤖', description: 'AI-powered features' },
    { name: 'Recharts', icon: '📊', description: 'Data visualization' },
    { name: 'Web Speech API', icon: '🎤', description: 'Voice integration' },
  ];

  const keyFeatures = [
    { icon: FiShield, title: '🔒 Secure & Private', description: 'Your data stays on your device' },
    { icon: FiZap, title: '⚡ Lightning Fast', description: 'Optimized performance' },
    { icon: FiTarget, title: '🎯 User Friendly', description: 'Intuitive interface' },
    { icon: MdVerified, title: '✓ Verified AI', description: 'Gemini-powered accuracy' },
    { icon: FiTrendingUp, title: '📈 Analytics', description: 'Track your progress' },
    { icon: FiUsers, title: '👥 Community', description: 'Join thousands of users' },
  ];

  const FeatureTab = ({ feature }: { feature: (typeof features)[0] }) => (
    <div className="glass rounded-2xl backdrop-blur-xl border border-white/20 p-6 hover-lift transition-all">
      <div className="text-4xl mb-3">{feature.icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
      <p className="text-white/70 text-sm mb-4">{feature.description}</p>
      <ul className="space-y-2">
        {feature.details.map((detail, idx) => (
          <li key={idx} className="flex items-start gap-2 text-white/80 text-sm">
            <span className="text-cyan-400 mt-1">✓</span>
            <span>{detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="md:ml-64 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 relative overflow-hidden p-4 md:p-8">
      {/* Floating Background Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="animate-float1 absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="animate-float2 absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="animate-float3 absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16 animate-slide-in-down text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse-glow">
              <MdHealthAndSafety size={48} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mb-4">
            AuraHealth
          </h1>
          <p className="text-cyan-200 text-xl md:text-2xl font-semibold mb-2">Your Personal AI Healthcare Assistant</p>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            An intelligent, voice-enabled healthcare companion powered by Gemini AI to help you manage your health, track vitals, and access personalized medical guidance.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <span className="px-4 py-2 bg-cyan-500/30 border border-cyan-400/50 rounded-full text-cyan-200 text-sm font-semibold">
              🚀 Preview Version 1.0
            </span>
            <span className="px-4 py-2 bg-green-500/30 border border-green-400/50 rounded-full text-green-200 text-sm font-semibold">
              ✨ AI Powered
            </span>
          </div>
        </div>

        {/* Key Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <MdRocket size={32} className="text-yellow-400" /> Key Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keyFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="glass rounded-2xl backdrop-blur-xl border border-white/20 p-6 hover-lift animate-scale-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <Icon className="text-3xl text-cyan-400 mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/70 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* All Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <FiHeart size={32} className="text-red-400" /> Complete Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, idx) => (
              <FeatureTab key={idx} feature={feature} />
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <MdSchool size={32} className="text-purple-400" /> Technology Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technologies.map((tech, idx) => (
              <div
                key={idx}
                className="glass rounded-2xl backdrop-blur-xl border border-white/20 p-6 hover-lift animate-bounce-slow"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="text-4xl mb-3">{tech.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{tech.name}</h3>
                <p className="text-white/70 text-sm">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-16">
          <div className="flex gap-2 mb-6 flex-wrap">
            {[
              { id: 'mission', label: '🎯 Mission', icon: FiTarget },
              { id: 'vision', label: '👁️ Vision', icon: FiZap },
              { id: 'benefits', label: '💚 Benefits', icon: FiHeart },
              { id: 'support', label: '🤝 Support', icon: FiUsers },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setExpandedTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  expandedTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'glass hover:bg-white/20 text-white/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="glass rounded-3xl backdrop-blur-xl border border-white/20 p-8 animate-slide-in-down">
            {expandedTab === 'mission' && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <FiTarget className="text-cyan-400" size={28} /> Our Mission
                </h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  To empower individuals to take control of their health through an intelligent, accessible AI-powered healthcare assistant that provides personalized medical guidance, symptom tracking, and comprehensive health management tools. We believe everyone deserves access to quality healthcare support.
                </p>
              </div>
            )}

            {expandedTab === 'vision' && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <FiZap className="text-yellow-400" size={28} /> Our Vision
                </h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  To become the world's most trusted AI healthcare companion, making preventive healthcare accessible to everyone. We envision a future where technology bridges the gap between patients and healthcare providers, enabling early detection, personalized treatment, and better health outcomes globally.
                </p>
              </div>
            )}

            {expandedTab === 'benefits' && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <FiHeart className="text-red-400" size={28} /> User Benefits
                </h3>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 font-bold text-xl">✓</span>
                    <span><strong>24/7 Health Support:</strong> Get answers to health questions anytime</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 font-bold text-xl">✓</span>
                    <span><strong>Data Privacy:</strong> Your health data stays on your device</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 font-bold text-xl">✓</span>
                    <span><strong>Personalized Care:</strong> AI-powered recommendations tailored to you</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 font-bold text-xl">✓</span>
                    <span><strong>Emergency Ready:</strong> Quick access to hospital locations and emergency info</span>
                  </li>
                </ul>
              </div>
            )}

            {expandedTab === 'support' && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <FiUsers className="text-purple-400" size={28} /> Support & Community
                </h3>
                <p className="text-white/80 text-lg leading-relaxed mb-4">
                  We're here to help! Visit our support center for:
                </p>
                <ul className="space-y-2 text-white/80">
                  <li>• 📧 Email support: support@aurahealth.com</li>
                  <li>• 📞 Phone support: +1 (800) Health</li>
                  <li>• 💬 Live chat on our website</li>
                  <li>• 📚 Comprehensive documentation</li>
                  <li>• 👥 Active community forum</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="glass rounded-3xl backdrop-blur-xl border border-red-400/50 p-8 mb-16 bg-red-500/10 animate-slide-in-down">
          <h3 className="text-2xl font-bold text-red-200 mb-4">⚠️ Important Disclaimer</h3>
          <p className="text-red-100 leading-relaxed">
            AuraHealth is an AI-powered informational tool and should <strong>NOT</strong> be used as a replacement for professional medical advice. Always consult qualified healthcare professionals for medical decisions. The developers assume no liability for health-related decisions based on this application. This is a PREVIEW version in active development.
          </p>
        </div>

        {/* Creator Section */}
        <div className="glass rounded-3xl backdrop-blur-xl border border-white/20 p-12 text-center mb-8 hover-lift animate-slide-in-up">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mb-4">
            Crafted with Passion & Precision
          </h2>
          <div className="space-y-6 mt-8">
            <div className="p-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-400/30">
              <div className="text-5xl mb-3">✨</div>
              <h3 className="text-2xl font-bold text-white mb-2">Designed by</h3>
              <p className="text-cyan-200 text-lg font-bold">Vedant Zope</p>
              <p className="text-white/60 text-sm mt-2">UI/UX Designer & Product Visionary</p>
            </div>
            <div className="text-white/70 text-lg">✕</div>
            <div className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30">
              <div className="text-5xl mb-3">💻</div>
              <h3 className="text-2xl font-bold text-white mb-2">Coded by</h3>
              <p className="text-purple-200 text-lg font-bold">Vedant Zope</p>
              <p className="text-white/60 text-sm mt-2">Full-Stack Developer</p>
              <p className="text-white/50 text-sm mt-4 italic">
                "Coded with Passion and Precision"
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/10">
          <p className="text-white/60 text-sm mb-2">
            © 2026 AuraHealth. All rights reserved.
          </p>
          <p className="text-white/40 text-xs">
            Designed by <span className="text-cyan-300 font-bold">Vedant Zope</span> | Coded with <span className="text-red-400">❤️</span> and Precision
          </p>
          <div className="mt-4 space-y-1">
            <p className="text-white/40 text-xs">
              Made with ❤️ to revolutionize healthcare access
            </p>
            <p className="text-white/30 text-xs">
              Empowering millions. One health metric at a time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
