import { NextResponse } from 'next/server'
import { streamLLMResponse } from '@/lib/ai/stream'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Spark API endpoint - Contextual AI assistant
 * 
 * Auth: None (dev mode - auth middleware disabled)
 * Body: { noteId: string, prompt: string }
 * Response: Streaming text/plain response
 * Side effects: None (read-only AI analysis)
 */
export async function POST(req: Request) {
  try {
    const { noteId, prompt } = await req.json()

    if (!noteId || !prompt) {
      return NextResponse.json(
        { error: 'noteId and prompt are required' },
        { status: 400 }
      )
    }

    // Fetch note content from Supabase
    const { data: note, error: noteError } = await supabaseAdmin
      .from('notes')
      .select('content')
      .eq('id', noteId)
      .single()

    if (noteError || !note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      )
    }

    const context = note.content ?? ''

    // Build contextual prompt for Spark
    const fullPrompt = `You are Spark, an AI thinking assistant. Analyze and expand on the note:\n\n"${context}"\n\nUser question: ${prompt}\n\nProvide a thoughtful, contextual response that helps the user understand and explore their note.`

    // Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await streamLLMResponse(fullPrompt, (text) => {
            controller.enqueue(new TextEncoder().encode(text))
          })
          controller.close()
        } catch (error) {
          console.error('[spark] Streaming error:', error)
          controller.error(error instanceof Error ? error : new Error('Streaming failed'))
        }
      },
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('[spark] API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

