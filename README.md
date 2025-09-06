# 🏥 Pocket Doctor

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![AI Powered](https://img.shields.io/badge/AI-Gemini-orange.svg)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-Educational-yellow.svg)](LICENSE)

**AI-Powered Healthcare Assistant for Instant Medical Analysis**

[🚀 Live Demo](#) • [📖 Documentation](#) • [🐛 Report Bug](#) • [💡 Request Feature](#)

</div>

---

## 📋 Overview

**Pocket Doctor** is a comprehensive, AI-powered healthcare web application that revolutionizes how users interact with medical technology. Built with cutting-edge web technologies and integrated with Google's Gemini AI, it provides instant symptom analysis, X-Ray image interpretation, and personalized wellness management.

### ✨ Key Highlights

- 🤖 **Advanced AI Integration** - Powered by Google's Gemini AI for medical insights
- 🏥 **Comprehensive Health Tools** - Symptom checker, X-Ray analysis, medication management
- 🌍 **Multi-language Support** - Available in 6 Indian languages
- 📱 **Responsive Design** - Seamless experience across all devices
- 🚨 **Emergency Features** - SOS button and emergency contact integration
- 🔒 **Privacy-First** - HIPAA-compliant design with local data storage

---

## 🚀 Features

### 🩺 Core Health Features

| Feature | Description | Status |
|---------|-------------|--------|
| **AI Symptom Checker** | Upload symptoms and get instant AI analysis with risk assessment | ✅ Active |
| **AI X-Ray Analysis** | Upload X-Ray images for AI-powered disease detection and analysis | ✅ Active |
| **Wellness Dashboard** | Track health metrics, daily activities, and wellness goals | ✅ Active |
| **Medication Manager** | Smart reminders and drug interaction checking | ✅ Active |
| **Health Dashboard** | Comprehensive health overview with real-time metrics | ✅ Active |

### 🧠 AI-Powered Analysis

- **🔬 Gemini AI Integration** - Advanced medical analysis using Google's Gemini API
- **🔍 Disease Detection** - AI analysis of X-Ray images for conditions like pneumonia, pneumothorax, fractures
- **⚠️ Risk Assessment** - Confidence scoring and urgency level determination
- **💊 Medical Recommendations** - Professional medical advice and next steps

### 🎨 User Experience

- **🔐 Authentication System** - Secure login/register with profile management
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **🌙 Dark/Light Theme** - Toggle between themes with persistent preferences
- **🌐 Multi-language Support** - English, Hindi, Bengali, Tamil, Telugu, Marathi
- **🔔 Real-time Notifications** - User feedback and status updates

### 🚨 Emergency Features

- **🆘 SOS Emergency Button** - Quick access to emergency contacts and services
- **🏥 Nearby Clinics** - Find hospitals and medical facilities
- **📞 Emergency Contacts** - Direct calling to emergency services
- **🩹 First Aid Guide** - Step-by-step emergency response procedures

---

## 🛠️ Tech Stack

### Backend
- **Node.js** 18+ - Runtime environment
- **Express.js** - Web application framework
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables
- **Vanilla JavaScript** - No framework dependencies
- **Responsive Design** - Mobile-first approach

### AI & APIs
- **Google Gemini AI** - Medical analysis and insights
- **OpenRouter API** - AI model access
- **RESTful APIs** - Clean API architecture

### Development Tools
- **npm** - Package management
- **Git** - Version control
- **Vercel** - Deployment platform

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18 or newer
- **Google AI Studio API Key** (for Gemini AI)
- **Modern Web Browser** (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pocket-doctor.git
   cd pocket-doctor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the project root:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Access the application**
   
   Open your browser and navigate to:
   - **Main App**: `http://localhost:3000`
   - **X-Ray Analysis**: `http://localhost:3000/xray-analysis.html`
   - **Profile Management**: `http://localhost:3000/profile.html`

### 🎯 Getting Your API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env` file

---

## 📱 Application Pages

### Core Pages
- **`index.html`** – Landing page with AI chat, features showcase, and navigation
- **`checker.html`** – AI-powered symptom checker with detailed analysis
- **`xray-analysis.html`** – AI X-Ray image analysis with disease detection
- **`wellness.html`** – Wellness hub with health tips and activity tracking
- **`dashboard.html`** – Health dashboard with metrics and quick actions
- **`medications.html`** – Medication management and interaction checking

### Authentication Pages
- **`login.html`** – User login with email/password
- **`register.html`** – User registration with profile creation
- **`profile.html`** – User profile management and settings

### Utility Pages
- **`result.html`** – Symptom analysis results display
- **`medications.html`** – Medication tracking and reminders

---

## 🤖 AI Integration

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | General health chat and Q&A |
| `/api/analyze-symptoms` | POST | Structured symptom analysis with risk assessment |
| `/api/analyze-xray` | POST | X-Ray image analysis with disease detection |
| `/api/scheme-query` | POST | Government health scheme queries |
| `/api/chatbot-query` | POST | AI chatbot for health assistance |

### AI Capabilities

- **🔬 Medical Analysis** - Professional-grade health assessments
- **🖼️ Image Processing** - X-Ray analysis with confidence scoring
- **⚠️ Risk Assessment** - Normal/Warning/Critical level determination
- **💊 Recommendations** - Actionable medical advice and next steps

---

## 🎨 Theming & Customization

### Theme System
- **🌙 Light/Dark Mode** - Toggle with persistent localStorage
- **🎨 CSS Variables** - Consistent theming across all components
- **📱 Responsive Design** - Mobile-first approach with breakpoints

### Customization
- **🎨 Color Schemes** - Easily customizable via CSS variables
- **📝 Typography** - Inter font family with multiple weights
- **🧩 Components** - Reusable UI components with consistent styling

---

## 🔧 Development

### Project Structure

```
pocket-doctor/
├── 📁 assets/
│   ├── 📁 css/
│   │   ├── styles.css      # Main stylesheet
│   │   └── auth.css        # Authentication styles
│   └── 📁 js/
│       ├── common.js       # Shared JavaScript
│       ├── chatbot.js      # AI chat functionality
│       ├── languages.js    # Multi-language support
│       └── sos-emergency.js # Emergency features
├── 📄 server.js            # Express server with AI endpoints
├── 📄 index.html           # Main landing page
├── 📄 xray-analysis.html   # X-Ray analysis page
├── 📄 profile.html         # User profile management
└── 📄 ...other pages
```

### Development Workflow

1. **📋 Plan Changes** - Identify the page or feature to modify
2. **✏️ Edit Code** - Update HTML, CSS, or JavaScript as needed
3. **🧪 Test Locally** - Run `npm start` and test in browser
4. **🎨 Check Themes** - Verify both light and dark modes work
5. **💾 Commit Changes** - Use clear, descriptive commit messages

### Code Guidelines

- **🎨 CSS Variables** - Use theme variables for consistent styling
- **📱 Responsive Design** - Mobile-first approach with proper breakpoints
- **⚠️ Error Handling** - Graceful fallbacks for API failures
- **🔒 Security** - Never expose API keys in client-side code

---

## 🚀 Deployment

### Vercel (Recommended)

1. **📤 Push to GitHub** - Commit your code to a GitHub repository
2. **🔗 Import to Vercel** - Connect your GitHub repo to Vercel
3. **⚙️ Set Environment Variables**:
   - `GEMINI_API_KEY` = Your Google AI Studio API key
4. **🚀 Deploy** - Vercel will automatically detect and deploy your Node.js app

### Other Platforms

| Platform | Description | Setup |
|----------|-------------|-------|
| **Heroku** | Cloud platform | Add `package.json` with start script |
| **Netlify** | Static site hosting | Use serverless functions for API endpoints |
| **Railway** | Modern cloud platform | Direct deployment with environment variables |

---

## 🔒 Security

### API Key Protection
- **🔐 Server-side Only** - API keys stored in `.env` file
- **🚫 No Client Exposure** - Keys never sent to browser
- **⚙️ Environment Variables** - Secure configuration management

### Data Privacy
- **💾 Local Storage** - User preferences stored locally
- **🚫 No Data Collection** - No personal health data stored on server
- **🏥 HIPAA Compliant** - Designed with healthcare privacy in mind

---

## 📊 Performance

### Image Optimization
- **🗜️ Automatic Compression** - X-Ray images compressed before API calls
- **📏 Size Limits** - 50MB server limit with smart resizing
- **🔄 Format Conversion** - Optimized JPEG output for better performance

### Loading States
- **⏳ Progress Indicators** - Visual feedback during AI analysis
- **⚠️ Error Handling** - Graceful fallbacks for failed requests
- **💾 Caching** - Static assets cached for faster loading

---

## 🆘 Emergency Features

### SOS Emergency
- **🚨 Quick Access** - One-click emergency button
- **📍 Location Services** - GPS-based emergency location sharing
- **📞 Emergency Contacts** - Direct calling to emergency services
- **💬 WhatsApp Integration** - Emergency message with location

### Medical Resources
- **🏥 Nearby Clinics** - Find hospitals and medical facilities
- **📞 Emergency Numbers** - Quick access to emergency services
- **🩹 First Aid Guide** - Step-by-step emergency procedures

---

## 🌐 Multi-language Support

### Supported Languages

| Language | Native Name | Status |
|----------|-------------|--------|
| **English** | English | ✅ Default |
| **Hindi** | हिंदी | ✅ Active |
| **Bengali** | বাংলা | ✅ Active |
| **Tamil** | தமிழ் | ✅ Active |
| **Telugu** | తెలుగు | ✅ Active |
| **Marathi** | मराठी | ✅ Active |

### Language Features
- **🎵 Voice Tips** - Audio health tips in local languages
- **🖼️ Pictorial Guidance** - Visual health instructions
- **🌍 Cultural Adaptation** - Region-specific health advice

---

## 📈 Future Enhancements

### Planned Features
- **📹 Telemedicine Integration** - Video consultations with doctors
- **📋 Health Records** - Digital health record management
- **⌚ Wearable Integration** - Connect with fitness trackers
- **🧠 Advanced AI Models** - More specialized medical AI

### Technical Improvements
- **📱 PWA Support** - Progressive Web App capabilities
- **📴 Offline Mode** - Basic functionality without internet
- **⚡ Real-time Updates** - WebSocket integration for live data

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### How to Contribute

1. **🍴 Fork the Repository** - Create your own copy
2. **🌿 Create Feature Branch** - `git checkout -b feature/amazing-feature`
3. **✏️ Make Changes** - Implement your improvements
4. **🧪 Test Thoroughly** - Ensure everything works correctly
5. **📤 Submit Pull Request** - Describe your changes clearly

### Code Standards

- **📝 Clean Code** - Readable and well-documented
- **🎨 Consistent Styling** - Follow existing patterns
- **⚠️ Error Handling** - Robust error management
- **🧪 Testing** - Test all new features thoroughly

### 🎯 Areas for Contribution

- **🐛 Bug Fixes** - Help us squash bugs
- **✨ New Features** - Add innovative functionality
- **📚 Documentation** - Improve our docs
- **🌍 Translations** - Add more language support
- **🎨 UI/UX** - Enhance the user experience

---

## 📄 License

This project is for **educational and personal use**. Please review all dependencies for their respective licenses.

---

## ⚠️ Medical Disclaimer

> **⚠️ Important**: This application is for informational purposes only and should not replace professional medical advice. Always consult with qualified healthcare professionals for medical diagnosis and treatment.

---

## 📞 Support

### Getting Help

- **🐛 GitHub Issues** - Report bugs and request features
- **📖 Documentation** - Check this README for common questions
- **💬 Community** - Join discussions in GitHub Discussions

### Quick Links

- [Report a Bug](https://github.com/yourusername/pocket-doctor/issues/new?template=bug_report.md)
- [Request a Feature](https://github.com/yourusername/pocket-doctor/issues/new?template=feature_request.md)
- [Ask a Question](https://github.com/yourusername/pocket-doctor/discussions)

---

<div align="center">

**🏥 Pocket Doctor** - Your AI-powered healthcare companion ✨

[![Star this repo](https://img.shields.io/badge/⭐-Star%20this%20repo-yellow.svg)](https://github.com/yourusername/pocket-doctor)
[![Fork this repo](https://img.shields.io/badge/🍴-Fork%20this%20repo-blue.svg)](https://github.com/yourusername/pocket-doctor/fork)
[![Contributions welcome](https://img.shields.io/badge/🤝-Contributions%20welcome-green.svg)](CONTRIBUTING.md)

Made with ❤️ for better healthcare accessibility

</div>