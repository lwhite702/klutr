/**
 * Nightly Smart Stacks Cron Job
 *
 * This script should be triggered by a scheduled HTTP ping (Vercel Cron, etc.)
 * It processes all users and builds/updates their Smart Stacks
 *
 * Usage: Can be called via an API route or directly as a serverless function
 */

import { prisma } from "../lib/db"
import { buildSmartStacks } from "../lib/ai/buildSmartStacks"

export async function runNightlyStacks() {
  console.log("[v0] Starting nightly stacks job...")

  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true, email: true },
    })

    console.log(`[v0] Processing ${users.length} users`)

    for (const user of users) {
      try {
        console.log(`[v0] Building stacks for user ${user.email}`)

        await buildSmartStacks(user.id)

        console.log(`[v0] Completed stacks for user ${user.email}`)
      } catch (error) {
        console.error(`[v0] Error processing user ${user.email}:`, error)
        // Continue with next user
      }
    }

    console.log("[v0] Nightly stacks job completed")
    return { success: true, usersProcessed: users.length }
  } catch (error) {
    console.error("[v0] Nightly stacks job failed:", error)
    throw error
  }
}

// If running as a standalone script
if (require.main === module) {
  runNightlyStacks()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
