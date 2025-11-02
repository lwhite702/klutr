/**
 * Nightly Clustering Cron Job
 *
 * This script should be triggered by a scheduled HTTP ping (Vercel Cron, etc.)
 * It processes all users and:
 * 1. Embeds notes that don't have embeddings yet
 * 2. Runs the clustering algorithm to organize notes
 *
 * Usage: Can be called via an API route or directly as a serverless function
 */

import { db } from "../lib/db"
import { embedNoteViaEdgeFunction } from "../lib/edge-functions"
import { embedNoteContent } from "../lib/ai/embedNote"

export async function runNightlyCluster() {
  console.log("[v0] Starting nightly clustering job...")

  try {
    // Get all users using Supabase
    const users = await db.getAllUsers()

    console.log(`[v0] Processing ${users.length} users`)

    for (const user of users) {
      try {
        console.log(`[v0] Processing user ${user.email}`)

        // Find notes without embeddings
        const notesWithoutEmbeddings = await db.getNotesWithoutEmbeddings(user.id, 100)

        console.log(`[v0] Found ${notesWithoutEmbeddings.length} notes to embed`)

        // Generate embeddings using Edge Function
        for (const note of notesWithoutEmbeddings) {
          try {
            // Try Edge Function first
            await embedNoteViaEdgeFunction(note.id, note.content)
          } catch (edgeError) {
            console.warn(`[v0] Edge Function embedding failed for note ${note.id}, using fallback:`, edgeError)
            // Fallback to direct embedding
            try {
              const embedding = await embedNoteContent(note.content)
              await db.updateNoteEmbedding(note.id, embedding)
            } catch (fallbackError) {
              console.error(`[v0] Failed to embed note ${note.id}:`, fallbackError)
            }
          }
        }

        // Run clustering using Edge Function
        try {
          const { clusterNotesViaEdgeFunction } = await import("../lib/edge-functions")
          await clusterNotesViaEdgeFunction(user.id)
        } catch (edgeFunctionError) {
          console.error(`[v0] Edge Function clustering failed for ${user.email}, falling back:`, edgeFunctionError)
          // Fallback to direct clustering
          const { clusterUserNotes } = await import("../lib/ai/clusterNotes")
          await clusterUserNotes(user.id)
        }

        console.log(`[v0] Completed clustering for user ${user.email}`)
      } catch (error) {
        console.error(`[v0] Error processing user ${user.email}:`, error)
        // Continue with next user
      }
    }

    console.log("[v0] Nightly clustering job completed")
    return { success: true, usersProcessed: users.length }
  } catch (error) {
    console.error("[v0] Nightly clustering job failed:", error)
    throw error
  }
}

// If running as a standalone script
if (require.main === module) {
  runNightlyCluster()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
