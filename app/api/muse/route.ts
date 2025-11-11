import { NextResponse } from 'next/server'
import { streamLLMResponse } from '@/lib/ai/stream'

/**
 * Muse API endpoint - Creative remix engine
 * 
 * Auth: None (dev mode - auth middleware disabled)
 * Body: { ideaA: string, ideaB: string }
 * Response: Streaming text/plain response
 * Side effects: None (read-only AI remix)
 */
export async function POST(req: Request) {
  try {
    const { ideaA, ideaB } = await req.json()

    if (!ideaA || !ideaB) {
      return NextResponse.json(
        { error: 'ideaA and ideaB are required' },
        { status: 400 }
      )
    }

    // Build remix prompt for Muse
    const prompt = `You are Muse, an idea remixer. Combine these two notes into a novel insight.\n\nIdea A: "${ideaA}"\n\nIdea B: "${ideaB}"\n\nReturn one short paragraph that blends both ideas creatively. Be insightful and original.`

    // Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await streamLLMResponse(prompt, (text) => {
            controller.enqueue(new TextEncoder().encode(text))
          })
          controller.close()
        } catch (error) {
          console.error('[muse] Streaming error:', error)
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
    console.error('[muse] API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

