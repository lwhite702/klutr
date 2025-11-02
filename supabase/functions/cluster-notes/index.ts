// Supabase Edge Function: Cluster Notes
// Performs nightly clustering of user notes

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const CLUSTER_THRESHOLD = 0.35

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify cron secret (if provided)
    const authHeader = req.headers.get('authorization')
    const cronSecret = Deno.env.get('CRON_SECRET')
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    const { userId } = await req.json().catch(() => ({ userId: null }))

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get notes with embeddings
    const { data: notes, error: notesError } = await supabaseClient
      .from('notes')
      .select('id, type, embedding')
      .eq('user_id', userId)
      .not('embedding', 'is', null)

    if (notesError) {
      throw notesError
    }

    if (!notes || notes.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No notes with embeddings found', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate centroids for each base type
    const typeGroups = new Map<string, number[][]>()

    for (const note of notes) {
      if (note.type === 'unclassified' || note.type === 'nope') continue

      const embedding = parseEmbedding(note.embedding as string)
      if (!embedding) continue

      if (!typeGroups.has(note.type)) {
        typeGroups.set(note.type, [])
      }
      typeGroups.get(note.type)!.push(embedding)
    }

    // Calculate centroids
    const centroids: Array<{ name: string; centroid: number[] }> = []
    for (const [type, embeddings] of typeGroups.entries()) {
      if (embeddings.length === 0) continue

      const centroid = calculateCentroid(embeddings)
      centroids.push({
        name: capitalizeType(type),
        centroid,
      })
    }

    // Assign each note to nearest centroid
    let clusteredCount = 0
    for (const note of notes) {
      const embedding = parseEmbedding(note.embedding as string)
      if (!embedding) continue

      let bestCluster = 'Misc'
      let bestDistance = 1.0
      let bestConfidence = 0.0

      for (const { name, centroid } of centroids) {
        if (centroid.length === 0) continue

        const distance = cosineDistance(embedding, centroid)
        if (distance < bestDistance) {
          bestDistance = distance
          bestCluster = name
        }
      }

      if (bestDistance < CLUSTER_THRESHOLD) {
        bestConfidence = 1 - bestDistance
      } else {
        bestCluster = 'Misc'
        bestConfidence = 0.5
      }

      // Update note with cluster assignment
      await supabaseClient
        .from('notes')
        .update({
          cluster: bestCluster,
          cluster_confidence: bestConfidence,
          cluster_updated_at: new Date().toISOString(),
        })
        .eq('id', note.id)

      clusteredCount++
    }

    return new Response(
      JSON.stringify({
        message: 'Clustering completed',
        clusteredCount,
        centroidCount: centroids.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in cluster-notes function:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function parseEmbedding(embeddingStr: string): number[] | null {
  try {
    const cleaned = embeddingStr.replace(/^\[|\]$/g, '')
    return cleaned.split(',').map(Number)
  } catch {
    return null
  }
}

function calculateCentroid(embeddings: number[][]): number[] {
  if (embeddings.length === 0) return []

  const dimensions = embeddings[0].length
  const centroid = new Array(dimensions).fill(0)

  for (const embedding of embeddings) {
    for (let i = 0; i < dimensions; i++) {
      centroid[i] += embedding[i]
    }
  }

  for (let i = 0; i < dimensions; i++) {
    centroid[i] /= embeddings.length
  }

  return centroid
}

function cosineDistance(a: number[], b: number[]): number {
  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  return 1 - similarity
}

function capitalizeType(type: string): string {
  const typeMap: Record<string, string> = {
    idea: 'Ideas',
    task: 'Tasks',
    contact: 'Contacts',
    link: 'Links',
    image: 'Images',
    voice: 'Voice',
    misc: 'Misc',
  }
  return typeMap[type] || 'Misc'
}
