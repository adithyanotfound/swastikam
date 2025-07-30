'use client'

import React, { useState, useEffect, useRef } from 'react'
import VoiceButton from './VoiceButton'
import ChatBubble from './ChatBubble'
import AppointmentForm from './AppointmentForm'
import AppointmentManager from './AppointmentManager'
// Backend API configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
import { Volume2, VolumeX, Settings, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface AppointmentData {
  name: string
  contact: string
  doctor: string
  date: string
  time: string
}

export default function VoiceKiosk() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [conversationState, setConversationState] = useState('greeting')
  const [appointmentData, setAppointmentData] = useState<Partial<AppointmentData>>({})
  const [showForm, setShowForm] = useState(false)
  const [showTextInput, setShowTextInput] = useState(false)
  const [showAppointmentManager, setShowAppointmentManager] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  
  // Function to toggle audio
  const toggleAudio = () => {
    if (isAudioEnabled) {
      // If turning off audio, stop any current speech
      speechSynthesis.cancel()
      setIsSpeaking(false)
    } else {
      // If turning on audio, speak the last bot message if it exists
      const lastMessage = messages[messages.length - 1]
      if (lastMessage && lastMessage.sender === 'bot') {
        speakText(lastMessage.text)
      }
    }
    setIsAudioEnabled(!isAudioEnabled)
  }

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for speech recognition support
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = 'en-US'
        recognitionRef.current.maxAlternatives = 1

        recognitionRef.current.onstart = () => {
          console.log('Speech recognition started')
          setIsListening(true)
        }

        recognitionRef.current.onresult = (event: any) => {
          console.log('Speech recognition result:', event)
          const transcript = event.results[0][0].transcript
          console.log('Transcript:', transcript)
          handleUserInput(transcript)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
          
          // Show user-friendly error messages
          if (event.error === 'not-allowed') {
            addBotMessage("Please allow microphone access to use voice commands. You can also use the touch interface.")
          } else if (event.error === 'no-speech') {
            addBotMessage("I didn't hear anything. Please try speaking again.")
          } else {
            addBotMessage("There was an issue with voice recognition. Please try again or use the touch interface.")
          }
        }

        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended')
          setIsListening(false)
        }

        recognitionRef.current.onaudiostart = () => {
          console.log('Audio capturing started')
        }

        recognitionRef.current.onaudioend = () => {
          console.log('Audio capturing ended')
        }

        recognitionRef.current.onsoundstart = () => {
          console.log('Sound detected')
        }

        recognitionRef.current.onsoundend = () => {
          console.log('Sound ended')
        }

        recognitionRef.current.onspeechstart = () => {
          console.log('Speech started')
        }

        recognitionRef.current.onspeechend = () => {
          console.log('Speech ended')
        }
      } else {
        console.warn('Speech recognition not supported in this browser')
        addBotMessage("Voice recognition is not supported in your browser. Please use the touch interface.")
      }
    }

    // Add initial greeting
    if (recognitionRef.current) {
      addBotMessage("Hello! I'm the desk assistant at Dr. Kumar Awadhesh's clinic. I can help you book appointments. Dr. Kumar Awadhesh is a Consultant Surgeon with expertise in Renal Transplant, Minimal Invasive Surgery, Bariatric Surgery, Endoscopy and Cancer Surgery. Would you like to book an appointment?")
    } else {
      addBotMessage("Hello! I'm the desk assistant at Dr. Kumar Awadhesh's clinic. Voice recognition is not available in your browser, but you can use the text input below to interact with me. I can help you book appointments.")
    }
  }, [])

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const addBotMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
    
    // Only speak if audio is enabled
    if (isAudioEnabled) {
      speakText(text)
    }
  }

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const speakText = async (text: string) => {
    setIsSpeaking(true)
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.useFallback) {
          // Use browser TTS as fallback
          const utterance = new SpeechSynthesisUtterance(text)
          utterance.rate = 0.9 // Slightly slower for clarity
          utterance.pitch = 1.0
          utterance.volume = 1.0
          utterance.onend = () => setIsSpeaking(false)
          utterance.onerror = () => setIsSpeaking(false)
          speechSynthesis.speak(utterance)
        } else {
          // Handle Deepgram audio response (when implemented)
          const audioBlob = await response.blob()
          const audioUrl = URL.createObjectURL(audioBlob)
          const audio = new Audio(audioUrl)
          audio.onended = () => {
            setIsSpeaking(false)
            URL.revokeObjectURL(audioUrl)
          }
          audio.play()
        }
      } else {
        // Fallback to browser TTS
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.onend = () => setIsSpeaking(false)
        speechSynthesis.speak(utterance)
      }
    } catch (error) {
      console.error('TTS error:', error)
      // Fallback to browser TTS
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onend = () => setIsSpeaking(false)
      speechSynthesis.speak(utterance)
    }
  }

  const handleUserInput = async (userText: string) => {
    addUserMessage(userText)
    
    try {
      // Call backend API
      const response = await fetch(`${BACKEND_URL}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userPrompt: userText }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const result = data.obj

      // Handle the response
      if (result.query && result.query !== "END") {
        // This is a confirmed appointment
        console.log('Appointment booked:', result.query)
        addBotMessage(`Appointment confirmed! ${result.reply}`)
        
        // Reset for next appointment
        setAppointmentData({})
        setShowForm(false)
      } else if (result.query === "END") {
        // End conversation
        addBotMessage(result.reply)
        // Could add logic here to end the session
      } else {
        // Regular response
        setTimeout(() => {
          addBotMessage(result.reply)
        }, 500)
      }
    } catch (error) {
      console.error('Error calling backend API:', error)
      addBotMessage("I'm having trouble connecting to the server. Please try again or contact support.")
    }
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        console.log('Starting speech recognition...')
        recognitionRef.current.start()
      } catch (error) {
        console.error('Error starting speech recognition:', error)
        setIsListening(false)
        addBotMessage("There was an issue starting voice recognition. Please try again.")
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        console.log('Stopping speech recognition...')
        recognitionRef.current.stop()
      } catch (error) {
        console.error('Error stopping speech recognition:', error)
        setIsListening(false)
      }
    }
  }

  const handleFormSubmit = (formData: AppointmentData) => {
    // Here you would typically send to your backend
    console.log('Appointment booked:', formData)
    
    addBotMessage(`Perfect! Your appointment with Dr. Kumar Awadhesh is confirmed for ${formData.date} at ${formData.time}. You'll receive an SMS confirmation shortly. Thank you for choosing our clinic!`)
    
    setShowForm(false)
    setConversationState('greeting')
    setAppointmentData({})
  }

  return (
    <>
      <Card className="w-full mx-auto shadow-2xl overflow-hidden">
        {/* Chat Area */}
        <CardHeader className="bg-muted/50 border-b p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-lg sm:text-xl">AI Assistant Chat</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAppointmentManager(true)}
              className="flex items-center space-x-2 w-full sm:w-auto"
            >
              <Calendar className="h-4 w-4" />
              <span className="text-sm sm:text-base">Manage Appointments</span>
            </Button>
          </div>
        </CardHeader>
        
        <div className="h-64 sm:h-80 md:h-96 bg-muted/30 p-3 sm:p-4 md:p-6">
          <div 
            ref={chatContainerRef}
            className="h-full overflow-y-auto chat-container space-y-3 sm:space-y-4"
          >
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
          </div>
        </div>

        {/* Voice Control Area */}
        <CardContent className="p-4 sm:p-6 md:p-8 border-t">
          <div className="flex flex-col items-center space-y-4 sm:space-y-6">
            {!showForm ? (
              <>
                {/* Audio Control Button */}
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <VoiceButton 
                    isListening={isListening}
                    isSpeaking={isSpeaking}
                    onStart={startListening}
                    onStop={stopListening}
                  />
                  
                  <Button
                    variant={isAudioEnabled ? "default" : "destructive"}
                    size="icon"
                    onClick={toggleAudio}
                    title={isAudioEnabled ? 'Mute Bot Audio' : 'Unmute Bot Audio'}
                    className="h-12 w-12 sm:h-10 sm:w-10"
                  >
                    {isAudioEnabled ? (
                      <Volume2 className="h-5 w-5" />
                    ) : (
                      <VolumeX className="h-5 w-5" />
                    )}
                  </Button>
                  
                  {/* Audio status indicator */}
                  {!isAudioEnabled && (
                    <div className="text-xs text-destructive font-medium">
                      Audio Muted
                    </div>
                  )}
                </div>
                
                <div className="text-center w-full max-w-md">
                  <p className="text-muted-foreground mb-2 text-sm sm:text-base">
                    {isListening ? 'Listening... Speak now!' : 'Tap the microphone to speak'}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                    Try saying: "I want to book an appointment"
                  </p>
                  
                  {/* Audio Status */}
                  <div className="text-xs text-muted-foreground mb-4 space-y-1">
                    <p>Status: {isListening ? 'Listening' : 'Ready'}</p>
                    <p>Speech Recognition: {recognitionRef.current ? 'Available' : 'Not Available'}</p>
                    <p>Bot Audio: {isAudioEnabled ? 'Enabled' : 'Disabled'}</p>
                  </div>
                  
                  {/* Text input fallback */}
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTextInput(!showTextInput)}
                      className="text-xs sm:text-sm"
                    >
                      {showTextInput ? 'Hide' : 'Show'} Text Input
                    </Button>
                    
                    {showTextInput && (
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <input
                          type="text"
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                          placeholder="Type your message here..."
                          className="flex-1 px-3 py-2 border border-input rounded-lg text-sm bg-background"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && textInput.trim()) {
                              handleUserInput(textInput.trim())
                              setTextInput('')
                            }
                          }}
                        />
                        <Button
                          onClick={() => {
                            if (textInput.trim()) {
                              handleUserInput(textInput.trim())
                              setTextInput('')
                            }
                          }}
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          Send
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <AppointmentForm 
                initialData={appointmentData}
                onSubmit={handleFormSubmit}
                onCancel={() => setShowForm(false)}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Appointment Manager Modal */}
      {showAppointmentManager && (
        <AppointmentManager onClose={() => setShowAppointmentManager(false)} />
      )}
    </>
  )
} 