// Helper functions for calling Supabase Edge Functions

import { createSupabaseClient } from './supabase'

/**
 * Call the classify-note Edge Function
 */
export async function classifyNoteViaEdgeFunction(noteId: string, content: string): Promise<{
  type: string
  tags: string[]
  note?: any
}> {
  const supabase = createSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }

  const { data, error } = await supabase.functions.invoke('classify-note', {
    body: { noteId, content },
  })

  if (error) {
    throw new Error(`Failed to classify note: ${error.message}`)
  }

  return data as { type: string; tags: string[]; note?: any }
}

/**
 * Call the embed-note Edge Function
 */
export async function embedNoteViaEdgeFunction(noteId: string, content: string): Promise<{
  success: boolean
  noteId: string
  embeddingLength: number
}> {
  const supabase = createSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }

  const { data, error } = await supabase.functions.invoke('embed-note', {
    body: { noteId, content },
  })

  if (error) {
    throw new Error(`Failed to embed note: ${error.message}`)
  }

  return data as { success: boolean; noteId: string; embeddingLength: number }
}

/**
 * Call the cluster-notes Edge Function
 */
export async function clusterNotesViaEdgeFunction(userId: string): Promise<{
  message: string
  clusteredCount: number
  centroidCount: number
}> {
  const supabase = createSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }

  const { data, error } = await supabase.functions.invoke('cluster-notes', {
    body: { userId },
  })

  if (error) {
    throw new Error(`Failed to cluster notes: ${error.message}`)
  }

  return data as { message: string; clusteredCount: number; centroidCount: number }
}

/**
 * Call the generate-insights Edge Function
 */
export async function generateInsightsViaEdgeFunction(
  userId: string,
  weekStart: string
): Promise<{
  success: boolean
  insight: any
}> {
  const supabase = createSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }

  const { data, error } = await supabase.functions.invoke('generate-insights', {
    body: { userId, weekStart },
  })

  if (error) {
    throw new Error(`Failed to generate insights: ${error.message}`)
  }

  return data as { success: boolean; insight: any }
}
