'use client'

import React from 'react'
import { User, Bot } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface ChatBubbleProps {
  message: Message
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.sender === 'user'
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-2 sm:space-x-3 max-w-xs sm:max-w-sm md:max-w-md ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary' : 'bg-muted'
        }`}>
          {isUser ? (
            <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
          ) : (
            <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          )}
        </div>
        
        <div className={`max-w-xs sm:max-w-sm md:max-w-md rounded-2xl p-3 sm:p-4 shadow-lg ${
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-card text-card-foreground border'
        }`}>
          <p className="text-xs sm:text-sm leading-relaxed">{message.text}</p>
          <p className={`text-xs mt-1 sm:mt-2 opacity-60`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  )
} 