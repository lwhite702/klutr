/**
 * Weekly Insights Cron Job
 *
 * This script should be triggered weekly (e.g., every Monday morning)
 * It processes all users and generates weekly insights summaries
 *
 * Usage: Can be called via an API route or directly as a serverless function
 */

import { prisma } from "../lib/db"
import { generateWeeklyInsights } from "../lib/ai/generateWeeklyInsights"

export async function runWeeklyInsights() {
  console.log("[v0] Starting weekly insights job...")

  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true, email: true },
    })

    console.log(`[v0] Processing ${users.length} users`)

    for (const user of users) {
      try {
        console.log(`[v0] Generating insights for user ${user.email}`)

        await generateWeeklyInsights(user.id)

        console.log(`[v0] Completed insights for user ${user.email}`)
      } catch (error) {
        console.error(`[v0] Error processing user ${user.email}:`, error)
        // Continue with next user
      }
    }

    console.log("[v0] Weekly insights job completed")
    return { success: true, usersProcessed: users.length }
  } catch (error) {
    console.error("[v0] Weekly insights job failed:", error)
    throw error
  }
}

// If running as a standalone script
if (require.main === module) {
  runWeeklyInsights()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
