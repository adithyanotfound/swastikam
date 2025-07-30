# 🏥 Dr. Kumar Awadhesh Clinic - Full Stack Setup Guide

This guide will help you set up and run both the frontend and backend for the clinic assistant system.

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- Google Gemini API key

## 🚀 Quick Setup

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and API keys

# Set up database
npx prisma generate
npx prisma db push

# Start backend server
npm run dev
```

Backend will run on: `http://localhost:3001`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with backend URL

# Start frontend server
npm run dev
```

Frontend will run on: `http://localhost:3000`

## 🔧 Environment Configuration

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/clinic_db"
GEMINI_API_KEY="your_gemini_api_key"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=Dr. Kumar Awadhesh Clinic
```

## 🗄️ Database Setup

1. **Install PostgreSQL** if not already installed
2. **Create database**:
   ```sql
   CREATE DATABASE clinic_db;
   ```
3. **Run Prisma migrations**:
   ```bash
   cd backend
   npx prisma db push
   ```

## 🤖 AI Setup

1. **Get Google Gemini API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add to backend `.env` file

## 🎯 Testing the Integration

1. **Start both servers** (backend on 3001, frontend on 3000)
2. **Open frontend** in browser: `http://localhost:3000`
3. **Test voice commands**:
   - "I want to book an appointment"
   - "My name is John Smith"
   - "My contact is 9876543210"
   - "I want tomorrow"
   - "4:30 PM"
   - "Yes, that's correct"

## 🔍 Troubleshooting

### Backend Issues
- **Database connection**: Check PostgreSQL is running
- **API key**: Verify Gemini API key is correct
- **Port conflict**: Change port in `backend/src/app.ts`

### Frontend Issues
- **Backend connection**: Check `NEXT_PUBLIC_BACKEND_URL` in `.env.local`
- **CORS errors**: Backend CORS is configured for localhost:3000
- **Voice recognition**: Check browser permissions

### Common Commands
```bash
# Backend
npm run dev          # Start development server
npm run build        # Build for production
npx prisma studio    # Open database GUI

# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

## 📊 API Endpoints

- `POST /api/v1/chat` - Main chat endpoint
- `GET /health` - Health check
- `GET /` - Root endpoint

## 🎨 Features

- ✅ Voice recognition and TTS
- ✅ AI-powered conversation
- ✅ Appointment booking with database
- ✅ Audio mute/unmute
- ✅ Time slot support (12/24 hour)
- ✅ Real-time chat interface
- ✅ Error handling and fallbacks

## 🚀 Production Deployment

### Backend (Railway/Heroku)
```bash
cd backend
npm run build
# Deploy to your preferred platform
```

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

Remember to update environment variables in production! 