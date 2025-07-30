import { NextRequest, NextResponse } from 'next/server'

// In a real application, you'd use a database
// For this demo, we'll use in-memory storage
let appointments: any[] = []

export async function POST(request: NextRequest) {
  try {
    const appointmentData = await request.json()
    
    // Validate required fields
    const requiredFields = ['surgeryType', 'date', 'time', 'patientName', 'phone']
    for (const field of requiredFields) {
      if (!appointmentData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Add appointment ID and timestamp
    const appointment = {
      id: Date.now().toString(),
      ...appointmentData,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    }

    // Store appointment (in real app, save to database)
    appointments.push(appointment)

    // In a real application, you would:
    // 1. Save to database
    // 2. Send SMS confirmation
    // 3. Send email confirmation
    // 4. Update calendar/schedule

    console.log('Appointment booked:', appointment)

    return NextResponse.json({
      success: true,
      appointment,
      message: 'Appointment booked successfully'
    })

  } catch (error) {
    console.error('Appointment booking error:', error)
    return NextResponse.json(
      { error: 'Failed to book appointment' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      appointments,
      count: appointments.length
    })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
} 