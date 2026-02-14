# 🏥 Autonomous AI Medicare Assistant

> **⚠️ PREVIEW VERSION** - This application is currently in preview/beta phase. Features and APIs may change.

An intelligent, voice-enabled healthcare assistant powered by Google Gemini AI, designed to help users manage their health, track vitals, schedule appointments, and receive personalized medical guidance.

![React](https://img.shields.io/badge/React-18+-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-Latest-purple?logo=vite)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-orange)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### 🎤 **Voice Assistant**
- Natural language voice commands to control the application
- Voice-enabled navigation and feature access
- Real-time speech-to-text and text-to-speech capabilities
- Personalized voice settings and preferences

### 📊 **Dashboard**
- Comprehensive health overview and metrics
- Quick access to all healthcare features
- Real-time health status monitoring
- Personalized recommendations

### 👨‍⚕️ **AI Nurse Chat**
- 24/7 intelligent chatbot powered by Gemini AI
- Symptom assessment and preliminary diagnosis
- Health advice and medical guidance
- Medication information and drug interaction checking

### 📝 **Symptoms Logger**
- Easy logging of symptoms and health issues
- Track symptom patterns over time
- Digital health records
- Exportable health data

### ❤️ **Vitals Tracker**
- Monitor blood pressure, heart rate, body temperature
- Track weight, blood sugar, and other vital signs
- Visual health trend analysis
- Health reminders and alerts

### 📅 **Appointments Hub**
- Schedule and manage medical appointments
- Appointment reminders and notifications
- Doctor/Healthcare provider directory
- Appointment history and follow-up tracking

### 🍎 **Diet & Nutrition Plan**
- AI-powered personalized diet recommendations (Gemini)
- Meal planning based on health conditions
- Calorie and nutrient tracking
- Dietary restriction management

### 🏥 **Hospital Locator**
- Find nearby hospitals and clinics
- Hospital information and ratings
- Emergency services locator
- Distance and directions to healthcare facilities

### 📄 **Receipt Analyzer**
- Scan and analyze medical receipts
- Automatic expense tracking
- Insurance claim assistance
- Receipt organization and storage

### 📋 **Health Reports**
- Comprehensive health summary reports
- Medical history documentation
- Laboratory results management
- Downloadable health reports for doctor visits

### 📱 **Fully Responsive Design**
- **Mobile-First**: Optimized touch interface for smartphones
- **Tablet-Friendly**: Adaptive layouts for tablet devices
- **Desktop-Ready**: Full-featured experience on laptops and desktops
- Seamless experience across all screen sizes
- Mobile navigation with slide-out menu
- Touch-optimized controls and buttons

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager
- **Gemini API Key** (Required - see setup below)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd autonoums-ai-medicare
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create a .env file in the root directory
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

#### Quick Deployment Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite configuration

3. **Configure Environment Variables**
   - In your Vercel project dashboard, go to **Settings** → **Environment Variables**
   - Add:
     - **Key**: `VITE_GEMINI_API_KEY`
     - **Value**: Your Gemini API key
     - **Environments**: Select all (Production, Preview, Development)
   - Click **Save**

4. **Redeploy**
   - Go to **Deployments** tab
   - Click **Redeploy** on the latest deployment
   - Your app is now live! 🎉

#### Environment Variable Modes:

The app works in two modes for maximum flexibility:

- **Mode 1 - With Environment Variable**: Users can skip API key entry on landing page and use the pre-configured key
- **Mode 2 - User Entry**: Users can still enter their own API key which takes priority over environment variables

This ensures:
- ✅ Seamless experience for deployed apps
- ✅ Privacy for users who want to use their own keys
- ✅ Easy local development

---

## 🔑 API Key Setup (REQUIRED)

This application requires a **Google Gemini API Key** to function properly. Without this key, the AI-powered features will not work.

### How to Get Your API Key:

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Click on **"Get API Key"**
3. Create a new API key or use an existing project
4. Copy your API key
5. Add it to your `.env` file:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

### ⚠️ IMPORTANT API KEY GUIDELINES:

- **KEEP CONFIDENTIAL**: Never share your API key or commit it to version control
- **Environment File**: Always use `.env` file and add it to `.gitignore`
- **Monitor Usage**: Check your API usage on the [Google Cloud Console](https://console.cloud.google.com)
- **Billing**: This is a **Preview** feature and billing may apply based on usage
- **Rate Limits**: Be aware of rate limits on your API key
- **Security**: Regenerate your key if accidentally exposed

### Example .env file:
```env
VITE_GEMINI_API_KEY=AIzaSyD_example_key_here_1234567890
```

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (with responsive utilities)
- **AI/ML**: Google Gemini AI API
- **Voice Processing**: Web Speech API
- **State Management**: React Context API
- **Code Quality**: ESLint, TypeScript strict mode
- **Deployment**: Vercel-ready with automatic CI/CD

---

## 📱 Responsive Design

The application is fully responsive and works seamlessly across all devices:

### Breakpoints (Tailwind CSS default):
- **Mobile**: `< 768px` - Optimized touch interface
- **Tablet**: `768px - 1024px` - Adaptive two-column layouts
- **Desktop**: `> 1024px` - Full multi-column experience

### Key Responsive Features:
- **Mobile Navigation**: Hamburger menu with slide-out sidebar
- **Touch-Optimized**: Large buttons and controls for mobile
- **Adaptive Grids**: Auto-adjusting layouts (1-column → 2-column → 3-column)
- **Flexible Typography**: Font sizes scale with viewport
- **Smart Padding**: Reduced spacing on mobile (`p-4`), expanded on desktop (`md:p-8`)
- **Hidden/Visible Elements**: Sidebar hidden on mobile, permanent on desktop

### Testing Responsive Design:
1. Open browser DevTools (F12)
2. Toggle device emulation
3. Test on: iPhone, iPad, Desktop
4. Or use: Chrome → View → Developer → Responsive

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.tsx
│   ├── VoiceControls.tsx
│   └── VoiceSettingsModal.tsx
├── pages/              # Feature pages
│   ├── Dashboard.tsx
│   ├── AppointmentsHub.tsx
│   ├── NurseChat.tsx
│   ├── SymptomsLogger.tsx
│   ├── VitalsTracker.tsx
│   ├── DietPlan.tsx
│   ├── HospitalLocator.tsx
│   ├── ReceiptAnalyzer.tsx
│   └── HealthReports.tsx
├── services/           # API & service integrations
│   ├── GeminiNurseService.ts
│   ├── GeminiDietService.ts
│   ├── VoiceAssistantService.ts
│   ├── HealthReportService.ts
│   └── ReceiptAnalyzerService.ts
├── context/            # React Context for state
│   └── AppContext.tsx
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
└── App.tsx             # Main app component
```

---

## 📱 Usage Examples

### Voice Command Examples
```
"Show me my vitals"
"Schedule an appointment with Dr. Johnson"
"What should I eat for diabetes?"
"Find hospitals near me"
"Log my blood pressure: 120/80"
"Analyze my medical receipt"
```

### Feature Workflow
1. **Start** → Land on Dashboard
2. **Log Symptoms** → Use Symptoms Logger
3. **Ask Nurse Chat** → Get AI recommendations (Gemini powered)
4. **Track Vitals** → Monitor health metrics
5. **Get Diet Plan** → Receive personalized nutrition advice
6. **Schedule Visit** → Book appointment at hospital

---

## ⚙️ Configuration

### Environment Variables
```env
# Required
VITE_GEMINI_API_KEY=your_api_key_here

# Optional
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=AI Medicare Assistant
VITE_DEBUG_MODE=false
```

### Tailwind CSS Customization
Edit `tailwind.config.js` to customize colors, fonts, and spacing.

---

## 🐛 Known Limitations (Preview Version)

- Voice support varies by browser (best on Chrome/Edge)
- Real-time hospital inventory not available
- Integration with actual medical systems coming soon
- Receipt OCR accuracy depends on image quality
- Gemini API rate limits apply
- Some features may have limited functionality in preview

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Support & Feedback

- **Issues**: Report bugs on GitHub Issues
- **Feature Requests**: Submit via GitHub Discussions
- **Documentation**: Check the Wiki for detailed guides
- **Email**: support@autonomousaimedicare.com

---

## ⚠️ Disclaimer

**This is a PREVIEW application for demonstration purposes.**

- ❌ Should **NOT** be used as a substitute for professional medical advice
- ✅ Always consult with qualified healthcare professionals for medical decisions
- The developers assume **NO LIABILITY** for health-related decisions based on this application
- Use at your own risk during the preview/beta phase

---

## 🔮 Roadmap

- [ ] Full EHR (Electronic Health Records) integration
- [ ] Real insurance provider API integration
- [ ] Mobile native apps (iOS/Android)
- [ ] Multi-language support
- [ ] Advanced analytics and trending
- [ ] Wearable device integration
- [ ] Telehealth video consultations
- [ ] Prescription management
- [ ] Lab result integration

---

## 🚨 Preview Version Notes

This application is in **ACTIVE DEVELOPMENT**. Please be aware that:

- Features may change without notice
- Data may not persist between updates
- Some functionality may be incomplete
- APIs and integrations are subject to change
- Performance optimization is ongoing
- Security features are being enhanced

We appreciate your patience and feedback as we develop this application!

---

**Made with ❤️ for better healthcare**

*Last Updated: February 2026*
