'use client'

import React, { useState } from 'react'
import { Calendar, Clock, User, Phone, Check, X } from 'lucide-react'
import { getTimeSlotsInBothFormats } from '../utils/dates'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface AppointmentData {
  name: string
  contact: string
  doctor: string
  date: string
  time: string
}

interface AppointmentFormProps {
  initialData: Partial<AppointmentData>
  onSubmit: (data: AppointmentData) => void
  onCancel: () => void
}

const availableTimes = getTimeSlotsInBothFormats().map(slot => `${slot.time24} (${slot.time12})`)
const availableDates = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
]

export default function AppointmentForm({ initialData, onSubmit, onCancel }: AppointmentFormProps) {
  const [formData, setFormData] = useState<AppointmentData>({
    name: initialData.name || '',
    contact: initialData.contact || '',
    doctor: initialData.doctor || 'surgeon',
    date: initialData.date || '',
    time: initialData.time || '',
  })
  const [errors, setErrors] = useState<Partial<AppointmentData>>({})

  // Phone number validation function
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\d{10}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<AppointmentData> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.contact.trim()) {
      newErrors.contact = 'Phone number is required'
    } else if (!validatePhoneNumber(formData.contact)) {
      newErrors.contact = 'Please enter a valid 10-digit phone number'
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required'
    }
    
    if (!formData.time) {
      newErrors.time = 'Time is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const updateField = (field: keyof AppointmentData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-sm sm:max-w-md mx-auto">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl text-center">
          Complete Your Appointment
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Doctor Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1 sm:mb-2">
              Doctor Type
            </label>
            <input
              type="text"
              value={formData.doctor}
              onChange={(e) => updateField('doctor', e.target.value)}
              className="w-full px-3 py-2 text-sm sm:text-base border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background"
              placeholder="e.g., surgeon"
              required
            />
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Preferred Date
            </label>
            <select
              value={formData.date}
              onChange={(e) => updateField('date', e.target.value)}
              className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-hospital-primary focus:border-transparent ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Select a date</option>
              {availableDates.map((date) => (
                <option key={date.value} value={date.value}>
                  {date.label}
                </option>
              ))}
            </select>
            {errors.date && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.date}</p>
            )}
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              <Clock className="inline h-4 w-4 mr-1" />
              Preferred Time
            </label>
            <select
              value={formData.time}
              onChange={(e) => updateField('time', e.target.value)}
              className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-hospital-primary focus:border-transparent ${
                errors.time ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Select a time</option>
              {availableTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.time && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.time}</p>
            )}
          </div>

          {/* Patient Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              <User className="inline h-4 w-4 mr-1" />
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-hospital-primary focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              <Phone className="inline h-4 w-4 mr-1" />
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.contact}
              onChange={(e) => updateField('contact', e.target.value)}
              className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-hospital-primary focus:border-transparent ${
                errors.contact ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your 10-digit phone number"
              required
            />
            {errors.contact && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.contact}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 text-sm sm:text-base"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 text-sm sm:text-base"
            >
              <Check className="h-4 w-4 mr-2" />
              Confirm Booking
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 