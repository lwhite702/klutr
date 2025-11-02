import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma, isDatabaseAvailable } from "@/lib/supabaseDb"

export async function GET(req: Request) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json([])
    }

    const user = await getCurrentUser(req)

    // Get cluster statistics from SmartStacks
    const stacks = await db.smartStack.findMany({
      where: { userId: user.id },
      orderBy: { noteCount: "desc" },
    })

    // Also get cluster counts from notes directly
    const clusterCounts = await db.$queryRaw<Array<{ cluster: string; count: bigint }>>`
      SELECT cluster, COUNT(*) as count
      FROM "Note"
      WHERE "userId" = ${user.id}
        AND cluster IS NOT NULL
        AND archived = false
      GROUP BY cluster
      ORDER BY count DESC
    `

    // Merge data from stacks and direct counts
    const clustersMap = new Map<string, { name: string; noteCount: number; summary: string }>()

    // Add from stacks (has summaries)
    for (const stack of stacks) {
      clustersMap.set(stack.name, {
        name: stack.name,
        noteCount: stack.noteCount,
        summary: stack.summary || "No summary available.",
      })
    }

    // Update counts from direct query (more accurate)
    for (const row of clusterCounts) {
      const existing = clustersMap.get(row.cluster)
      if (existing) {
        existing.noteCount = Number(row.count)
      } else {
        clustersMap.set(row.cluster, {
          name: row.cluster,
          noteCount: Number(row.count),
          summary: "A collection of related notes.",
        })
      }
    }

    const clusters = Array.from(clustersMap.values())

    return NextResponse.json(clusters)
  } catch (error) {
    console.error("[klutr] Failed to get clusters:", error)
    return NextResponse.json([])
  }
}
