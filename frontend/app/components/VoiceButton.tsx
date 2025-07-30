'use client'

import React from 'react'
import { Mic, MicOff, Volume2 } from 'lucide-react'

interface VoiceButtonProps {
  isListening: boolean
  isSpeaking: boolean
  onStart: () => void
  onStop: () => void
}

export default function VoiceButton({ isListening, isSpeaking, onStart, onStop }: VoiceButtonProps) {
  const handleClick = () => {
    if (isListening) {
      onStop()
    } else {
      onStart()
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isSpeaking}
      className={`
        relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-300 transform
        ${isListening 
          ? 'bg-red-500 hover:bg-red-600 scale-110 shadow-2xl' 
          : isSpeaking
          ? 'bg-blue-500 cursor-not-allowed'
          : 'bg-hospital-primary hover:bg-hospital-secondary hover:scale-105'
        }
        ${isListening ? 'voice-wave' : ''}
      `}
    >
      {isListening ? (
        <MicOff className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
      ) : isSpeaking ? (
        <Volume2 className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white animate-pulse" />
      ) : (
        <Mic className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
      )}
      
      {/* Ripple effect when listening */}
      {isListening && (
        <div className="absolute inset-0 rounded-full border-2 sm:border-3 md:border-4 border-red-300 animate-ping"></div>
      )}
    </button>
  )
} 