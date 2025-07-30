# 🏥 Swastikam Hospital - Voice-Enabled AI Receptionist Kiosk

A modern, voice-controlled hospital receptionist kiosk built with Next.js and Deepgram TTS for seamless patient interaction.

## ✨ Features

- 🎤 **Voice Input**: Speech-to-text using browser's Web Speech API
- 🗣️ **Voice Output**: High-quality TTS using Deepgram
- 📱 **Touch Interface**: Fallback touch controls for accessibility
- 📅 **Appointment Booking**: Complete voice-guided appointment scheduling
- 📁 **Report Upload**: File upload functionality
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 🔄 **Conversation Flow**: Intelligent conversation management
- 📊 **Real-time Chat**: Live chat interface with message history

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Node.js, Express, Prisma, PostgreSQL
- **AI**: Google Gemini 2.5 Flash
- **Styling**: Tailwind CSS
- **Voice TTS**: Deepgram API (optional)
- **Speech Recognition**: Web Speech API
- **Icons**: Lucide React
- **Deployment**: Vercel (frontend) + Railway/Heroku (backend)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend server running (see backend setup)
- Deepgram API key (optional - free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd swastikam-hospital-kiosk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
   # Optional: DEEPGRAM_API_KEY=your_deepgram_api_key_here
   ```

4. **Start the Backend Server**
   ```bash
   cd ../backend
   npm install
   npm run dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Voice Commands

The kiosk understands natural language commands:

- **"I want to book a cardiology appointment"**
- **"Schedule dermatology for Wednesday"**
- **"Book pediatrics consultation"**
- **"Upload my medical report"**
- **"What services do you offer?"**

### Conversation Flow

1. **Greeting**: Bot welcomes and asks how to help
2. **Intent Recognition**: Understands user's request
3. **Appointment Booking Flow**:
   - Department/Service selection (30+ departments)
   - Date selection (Mon-Fri)
   - Time slot selection (4-6 PM)
   - Patient name collection
   - Phone number collection
   - Confirmation and form display

### Touch Interface

- Large, accessible buttons
- Clear visual feedback
- Fallback for voice recognition issues
- Form-based appointment booking

## 📱 Kiosk Mode Setup

### For Android Tablet

1. **Install Chrome** (if not already installed)
2. **Enable Developer Options**:
   - Go to Settings > About Tablet
   - Tap "Build Number" 7 times
3. **Enable USB Debugging**:
   - Settings > Developer Options > USB Debugging
4. **Set up Kiosk Mode**:
   ```bash
   adb shell settings put global policy_control immersive.full=com.android.chrome
   ```
5. **Launch in Fullscreen**:
   - Open Chrome
   - Navigate to your app URL
   - Add to Home Screen
   - Launch from Home Screen

### For iPad

1. **Add to Home Screen**:
   - Open Safari
   - Navigate to your app
   - Tap Share > Add to Home Screen
2. **Launch in Fullscreen**:
   - Open from Home Screen
   - App will run in fullscreen mode

## 🔧 Configuration

### Environment Variables

```env
# Required
DEEPGRAM_API_KEY=your_deepgram_api_key

# Optional
NEXT_PUBLIC_APP_NAME=Swastikam Hospital
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Customization

#### Hospital Departments
Edit `app/utils/conversationLogic.ts`:
```typescript
const hospitalServices = {
  'cardiology': 'Cardiology',
  'orthopedics': 'Orthopedics',
  'neurology': 'Neurology',
  'dermatology': 'Dermatology',
  // Add more departments
}
```

#### Time Slots
```typescript
const timeSlots = ['4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM']
```

#### Voice Settings
Edit `app/api/tts/route.ts`:
```typescript
const audioResponse = await deepgram.speak({
  text: text,
  model: 'aura-asteria-en', // Change model
  voice: 'nova', // Change voice
  // Add more options
})
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variables
   - Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📊 API Endpoints

### TTS (Text-to-Speech)
```
POST /api/tts
Content-Type: application/json

{
  "text": "Hello, how can I help you?"
}
```

### Appointments
```
POST /api/appointments
Content-Type: application/json

{
  "surgeryType": "Renal Surgery",
  "date": "wednesday",
  "time": "4:30 PM",
  "patientName": "John Doe",
  "phone": "1234567890"
}
```

## 🎨 Customization

### Styling
- Edit `tailwind.config.js` for theme colors
- Modify `app/globals.css` for custom styles
- Update component styles in individual files

### Voice Interface
- Modify conversation logic in `app/utils/conversationLogic.ts`
- Update TTS settings in `app/api/tts/route.ts`
- Customize voice commands and responses

### UI Components
- Update `app/components/Header.tsx` for branding
- Modify `app/components/VoiceButton.tsx` for voice controls
- Customize `app/components/AppointmentForm.tsx` for form fields

## 🔒 Security Considerations

- API keys are stored server-side only
- HTTPS required for production
- Input validation on all forms
- Rate limiting recommended for production
- Regular security updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

## 🙏 Acknowledgments

- Deepgram for TTS capabilities
- Next.js team for the framework
- Tailwind CSS for styling
- Web Speech API for voice recognition

---

**Built with ❤️ for Swastikam Hospital** 