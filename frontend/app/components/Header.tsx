'use client'

import React from 'react'
import { Stethoscope, Volume2 } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow-lg border-b-4 border-hospital-primary">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-hospital-primary p-3 rounded-full">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-hospital-primary">
                Dr. Kumar Awadhesh
              </h1>
              <p className="text-gray-600 text-sm">
                Consultant Surgeon - AI Desk Assistant
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-hospital-light px-4 py-2 rounded-lg">
              <Volume2 className="h-5 w-5 text-hospital-primary" />
              <span className="text-sm font-medium text-hospital-primary">
                Voice Enabled
              </span>
            </div>
            
            <div className="text-right">
              <p className="text-xs text-gray-500">Specializations</p>
              <p className="text-sm font-medium text-gray-700">
                Renal Transplant • Minimal Invasive Surgery • Bariatric Surgery
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 