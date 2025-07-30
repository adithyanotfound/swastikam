'use client'

import React, { useState, useEffect } from 'react'
import { Edit, Trash2, Calendar, Clock, User, Phone, Save, X, Plus } from 'lucide-react'
import { getTimeSlotsInBothFormats } from '../utils/dates'

interface Appointment {
  id: string
  name: string
  contact: string
  doctor: string
  date: string
  time: string
  createdAt: string
  updatedAt: string
}

interface AppointmentManagerProps {
  onClose: () => void
}

const availableTimes = getTimeSlotsInBothFormats().map(slot => `${slot.time24} (${slot.time12})`)
const availableDates = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
]

export default function AppointmentManager({ onClose }: AppointmentManagerProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Appointment>>({})
  const [errors, setErrors] = useState<Partial<Appointment>>({})

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

  // Phone number validation function
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\d{10}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Appointment> = {}
    
    if (!editData.name?.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!editData.contact?.trim()) {
      newErrors.contact = 'Phone number is required'
    } else if (!validatePhoneNumber(editData.contact)) {
      newErrors.contact = 'Please enter a valid 10-digit phone number'
    }
    
    if (!editData.date) {
      newErrors.date = 'Date is required'
    }
    
    if (!editData.time) {
      newErrors.time = 'Time is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/appointments`)
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
      } else {
        console.error('Failed to fetch appointments')
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (appointment: Appointment) => {
    setEditingId(appointment.id)
    setEditData(appointment)
    setErrors({})
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditData({})
    setErrors({})
  }

  const handleSave = async () => {
    if (!validateForm() || !editingId) return

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/appointments/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      })

      if (response.ok) {
        await fetchAppointments()
        setEditingId(null)
        setEditData({})
        setErrors({})
      } else {
        const errorData = await response.json()
        alert(`Error updating appointment: ${errorData.message}`)
      }
    } catch (error) {
      console.error('Error updating appointment:', error)
      alert('Error updating appointment')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/appointments/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchAppointments()
      } else {
        alert('Error deleting appointment')
      }
    } catch (error) {
      console.error('Error deleting appointment:', error)
      alert('Error deleting appointment')
    }
  }

  const updateEditField = (field: keyof Appointment, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-4 sm:p-6 max-w-sm w-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hospital-primary mx-auto"></div>
          <p className="mt-2 text-gray-600 text-sm sm:text-base text-center">Loading appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-hospital-primary text-white p-4 sm:p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Manage Appointments</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-1"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-120px)]">
          {appointments.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-500 text-sm sm:text-base">No appointments found</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
                >
                  {editingId === appointment.id ? (
                    // Edit Form
                    <div className="space-y-3 sm:space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {/* Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <User className="inline h-4 w-4 mr-1" />
                            Name
                          </label>
                          <input
                            type="text"
                            value={editData.name || ''}
                            onChange={(e) => updateEditField('name', e.target.value)}
                            className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-hospital-primary focus:border-transparent ${
                              errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.name && (
                            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name}</p>
                          )}
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Phone className="inline h-4 w-4 mr-1" />
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={editData.contact || ''}
                            onChange={(e) => updateEditField('contact', e.target.value)}
                            className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-hospital-primary focus:border-transparent ${
                              errors.contact ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.contact && (
                            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.contact}</p>
                          )}
                        </div>

                        {/* Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Calendar className="inline h-4 w-4 mr-1" />
                            Date
                          </label>
                          <select
                            value={editData.date || ''}
                            onChange={(e) => updateEditField('date', e.target.value)}
                            className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-hospital-primary focus:border-transparent ${
                              errors.date ? 'border-red-500' : 'border-gray-300'
                            }`}
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

                        {/* Time */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Clock className="inline h-4 w-4 mr-1" />
                            Time
                          </label>
                          <select
                            value={editData.time || ''}
                            onChange={(e) => updateEditField('time', e.target.value)}
                            className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-hospital-primary focus:border-transparent ${
                              errors.time ? 'border-red-500' : 'border-gray-300'
                            }`}
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
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={handleSave}
                          className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm sm:text-base"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <div className="flex flex-col sm:flex-row justify-between items-start space-y-3 sm:space-y-0">
                      <div className="flex-1 w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <p className="text-xs sm:text-sm text-gray-500">Name</p>
                            <p className="font-medium text-sm sm:text-base">{appointment.name}</p>
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                            <p className="font-medium text-sm sm:text-base">{appointment.contact}</p>
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm text-gray-500">Doctor</p>
                            <p className="font-medium text-sm sm:text-base">{appointment.doctor}</p>
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm text-gray-500">Date & Time</p>
                            <p className="font-medium text-sm sm:text-base">{appointment.date} at {appointment.time}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-gray-400">
                            Created: {new Date(appointment.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2 w-full sm:w-auto justify-center sm:justify-end">
                        <button
                          onClick={() => handleEdit(appointment)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit appointment"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(appointment.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete appointment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 