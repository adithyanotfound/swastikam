import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // For now, we'll use browser TTS as the primary method
    // Deepgram integration can be added later when API key is available
    return NextResponse.json({ 
      message: 'Text received, using browser TTS',
      text: text,
      useFallback: true 
    }, { status: 200 })

  } catch (error) {
    console.error('TTS Error:', error)
    return NextResponse.json(
      { error: 'Failed to process text' },
      { status: 500 }
    )
  }
} 