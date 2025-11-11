// Supabase Edge Function: embed-note
// Generates embeddings for notes using OpenAI

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!

serve(async (req) => {
  try {
    const { content } = await req.json()

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Call OpenAI for embedding
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: content.slice(0, 8000),
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const embedding = data.data[0]?.embedding

    if (!embedding || !Array.isArray(embedding)) {
      throw new Error('Invalid embedding response')
    }

    return new Response(
      JSON.stringify({ embedding }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Embedding error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate embedding' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
