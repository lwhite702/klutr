import { prisma } from "../db"

export type TimelineWeek = {
  week: string
  count: number
  topics: string[]
}

export async function analyzeTimeline(userId: string): Promise<TimelineWeek[]> {
  try {
    // Get weekly note counts for the past 12 weeks
    const twelveWeeksAgo = new Date()
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84)

    // TODO: Implement raw query for Supabase - using fallback for now
    // Raw SQL queries not yet supported in Supabase adapter
    const weeklyData: Array<{ week: Date; count: bigint }> = [];

    const timeline: TimelineWeek[] = []

    for (const row of weeklyData) {
      const weekStart = new Date(row.week)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 7)

      // Get top tags/clusters for this week
      const notes = await prisma.note.findMany({
        where: {
          userId,
          createdAt: {
            gte: weekStart,
            lt: weekEnd,
          },
          archived: false,
        },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
        take: 20,
      })

      // Extract unique topics (clusters + tags)
      const topicsSet = new Set<string>()
      for (const note of notes) {
        if (note.cluster) topicsSet.add(note.cluster.toLowerCase())
        for (const nt of note.tags || []) {
          const tagName = (nt as any).tag?.name || (nt as any).tags?.name || (nt as any).name;
          if (tagName) topicsSet.add(tagName)
        }
      }

      const topics = Array.from(topicsSet).slice(0, 5)

      timeline.push({
        week: weekStart.toISOString().split("T")[0],
        count: Number(row.count),
        topics,
      })
    }

    return timeline
  } catch (error) {
    console.error("[v0] Timeline analysis error:", error)
    throw new Error(`Failed to analyze timeline: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
