'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Stethoscope } from 'lucide-react'
import VoiceKiosk from '../components/VoiceKiosk'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="relative z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-sm sm:text-base">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back to Home</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <div className="bg-primary p-2 rounded-lg">
                  <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-foreground">
                    AI Assistant
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Voice & Text Booking
                  </p>
                </div>
                <div className="sm:hidden">
                  <h1 className="text-base font-bold text-foreground">
                    AI Assistant
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Booking
                  </p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl lg:max-w-6xl mx-auto"
        >
          <VoiceKiosk />
        </motion.div>
      </main>
    </div>
  )
} 