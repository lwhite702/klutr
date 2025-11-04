// Supabase Edge Function: cluster-notes
// Clusters user notes using embeddings

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const CLUSTER_THRESHOLD = 0.35

serve(async (req) => {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Get all notes with embeddings
    const { data: notes, error } = await supabase
      .from('notes')
      .select('id, type, embedding')
      .eq('user_id', userId)
      .not('embedding', 'is', null)

    if (error) throw error

    if (!notes || notes.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No notes with embeddings found' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Group by type and calculate centroids
    const typeGroups = new Map<string, number[][]>()

    for (const note of notes) {
      if (note.type === 'unclassified' || note.type === 'nope') continue
      if (!note.embedding || !Array.isArray(note.embedding)) continue

      if (!typeGroups.has(note.type)) {
        typeGroups.set(note.type, [])
      }
      typeGroups.get(note.type)!.push(note.embedding)
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

    // Assign notes to clusters
    let updated = 0
    for (const note of notes) {
      if (!note.embedding || !Array.isArray(note.embedding)) continue

      let bestCluster = 'Misc'
      let bestDistance = 1.0
      let bestConfidence = 0.0

      for (const { name, centroid } of centroids) {
        if (centroid.length === 0) continue
        const distance = cosineDistance(note.embedding, centroid)
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

      await supabase
        .from('notes')
        .update({
          cluster: bestCluster,
          cluster_confidence: bestConfidence,
          cluster_updated_at: new Date().toISOString(),
        })
        .eq('id', note.id)

      updated++
    }

    return new Response(
      JSON.stringify({ 
        message: `Clustered ${updated} notes`,
        clusters: centroids.length 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Clustering error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to cluster notes' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

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
