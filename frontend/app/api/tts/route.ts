import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'Text is required and must be a non-empty string' }, { status: 400 })
    }

    const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY

    if (!DEEPGRAM_API_KEY) {
      console.warn('Deepgram API key not found, using fallback TTS')
      return NextResponse.json({ 
        message: 'Deepgram API key not configured, using browser TTS',
        text: text,
        useFallback: true 
      }, { status: 200 })
    }

    try {
      // Debug log to see what we're sending
      const payload = {
        text: text,
      };
      console.log('Sending to Deepgram:', JSON.stringify(payload, null, 2));
      
      // Call Deepgram TTS API (minimal valid payload)
      const response = await fetch('https://api.deepgram.com/v1/speak', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${DEEPGRAM_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Deepgram API error details:', errorText)
        throw new Error(`Deepgram API error: ${response.status} ${response.statusText} - ${errorText}`)
      }

      // Get the audio data as a buffer
      const audioBuffer = await response.arrayBuffer()
      
      // Return the audio data with proper headers
      return new NextResponse(audioBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/wav',
          'Content-Length': audioBuffer.byteLength.toString(),
        },
      })

    } catch (deepgramError) {
      console.error('Deepgram TTS Error:', deepgramError)
      
      // Fallback to browser TTS if Deepgram fails
      return NextResponse.json({ 
        message: 'Deepgram TTS failed, using browser TTS fallback',
        text: text,
        useFallback: true,
        error: deepgramError.message
      }, { status: 200 })
    }

  } catch (error) {
    console.error('TTS Error:', error)
    return NextResponse.json(
      { error: 'Failed to process text' },
      { status: 500 }
    )
  }
} 