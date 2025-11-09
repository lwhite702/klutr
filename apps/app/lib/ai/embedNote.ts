import { supabase } from '../supabase'

export async function embedNoteContent(content: string): Promise<number[]> {
  try {
    // Call Supabase Edge Function for embedding
    const { data, error } = await supabase.functions.invoke('embed-note', {
      body: { content },
    })

    if (error) throw error

    if (!data?.embedding || !Array.isArray(data.embedding)) {
      throw new Error('Invalid embedding response from Supabase function')
    }

    return data.embedding
  } catch (error) {
    console.error('[v0] Embedding error:', error)
    throw new Error(
      `Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
