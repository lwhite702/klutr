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

import { prisma } from "../lib/db"
import { embedNoteContent } from "../lib/ai/embedNote"
import { clusterUserNotes } from "../lib/ai/clusterNotes"

export async function runNightlyCluster() {
  console.log("[v0] Starting nightly clustering job...")

  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true, email: true },
    })

    console.log(`[v0] Processing ${users.length} users`)

    for (const user of users) {
      try {
        console.log(`[v0] Processing user ${user.email}`)

        // Find notes without embeddings
        const notesWithoutEmbeddings = await prisma.note.findMany({
          where: {
            userId: user.id,
            embedding: null,
            archived: false,
          },
          select: {
            id: true,
            content: true,
          },
          take: 100, // Process in batches
        })

        console.log(`[v0] Found ${notesWithoutEmbeddings.length} notes to embed`)

        // Generate embeddings
        for (const note of notesWithoutEmbeddings) {
          try {
            const embedding = await embedNoteContent(note.content)
            await prisma.$executeRaw`
              UPDATE notes
              SET embedding = ${JSON.stringify(embedding)}::vector
              WHERE id = ${note.id}
            `
          } catch (error) {
            console.error(`[v0] Failed to embed note ${note.id}:`, error)
          }
        }

        // Run clustering
        await clusterUserNotes(user.id)

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
