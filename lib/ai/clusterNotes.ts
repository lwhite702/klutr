import { getServerSupabase } from "../supabase"
import { db } from "../supabaseDb"

const CLUSTER_THRESHOLD = 0.35

type ClusterCentroid = {
  name: string
  centroid: number[]
}

export async function clusterUserNotes(userId: string): Promise<void> {
  try {
    // Step 1: Get all notes with embeddings for this user
    const supabase = getServerSupabase()
    const { data: notesWithEmbeddings, error } = await supabase
      .from('notes')
      .select('id, type, embedding')
      .eq('user_id', userId)
      .not('embedding', 'is', null)

    if (error) throw error

    if (!notesWithEmbeddings || notesWithEmbeddings.length === 0) {
      console.log("[klutr] No notes with embeddings found for clustering")
      return
    }

    // Step 2: Calculate centroids for each base type
    const typeGroups = new Map<string, number[][]>()

    for (const note of notesWithEmbeddings) {
      if (note.type === "unclassified" || note.type === "nope") continue

      const embedding = note.embedding as number[]
      if (!embedding) continue

      if (!typeGroups.has(note.type)) {
        typeGroups.set(note.type, [])
      }
      typeGroups.get(note.type)!.push(embedding)
    }

    // Calculate centroids (average embedding per type)
    const centroids: ClusterCentroid[] = []
    for (const [type, embeddings] of typeGroups.entries()) {
      if (embeddings.length === 0) continue

      const centroid = calculateCentroid(embeddings)
      centroids.push({
        name: capitalizeType(type),
        centroid,
      })
    }

    // Add a "Misc" centroid if we have enough notes
    if (notesWithEmbeddings.length > 10) {
      centroids.push({
        name: "Misc",
        centroid: [], // Will catch outliers
      })
    }

    // Step 3: Assign each note to nearest centroid
    for (const note of notesWithEmbeddings) {
      const embedding = note.embedding as number[]
      if (!embedding) continue

      let bestCluster = "Misc"
      let bestDistance = 1.0
      let bestConfidence = 0.0

      for (const { name, centroid } of centroids) {
        if (centroid.length === 0) continue // Skip Misc centroid in distance calc

        const distance = cosineDistance(embedding, centroid)
        if (distance < bestDistance) {
          bestDistance = distance
          bestCluster = name
        }
      }

      // Only assign cluster if distance is below threshold
      if (bestDistance < CLUSTER_THRESHOLD) {
        bestConfidence = 1 - bestDistance
      } else {
        bestCluster = "Misc"
        bestConfidence = 0.5
      }

      // Update note with cluster assignment
      await db.note.update({
        where: { id: note.id },
        data: {
          cluster: bestCluster,
          cluster_confidence: bestConfidence,
          cluster_updated_at: new Date(),
        },
      })
    }

    console.log(`[klutr] Clustered ${notesWithEmbeddings.length} notes into ${centroids.length} clusters`)
  } catch (error) {
    console.error("[klutr] Clustering error:", error)
    throw new Error(`Failed to cluster notes: ${error instanceof Error ? error.message : "Unknown error"}`)
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
  return 1 - similarity // Convert similarity to distance
}

function capitalizeType(type: string): string {
  const typeMap: Record<string, string> = {
    idea: "Ideas",
    task: "Tasks",
    contact: "Contacts",
    link: "Links",
    image: "Images",
    voice: "Voice",
    misc: "Misc",
  }
  return typeMap[type] || "Misc"
}
