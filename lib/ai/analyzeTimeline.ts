import { prisma } from "../db"
import { supabaseAdmin } from "../supabase"

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

    // Use Supabase RPC or query directly
    const { data: weeklyData, error } = await supabaseAdmin
      .from('notes')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', twelveWeeksAgo.toISOString())
      .eq('archived', false)

    if (error) throw error

    // Group by week manually
    const weekMap = new Map<string, number>()
    for (const note of weeklyData || []) {
      const date = new Date(note.created_at)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay()) // Get Monday
      weekStart.setHours(0, 0, 0, 0)
      const weekKey = weekStart.toISOString().split('T')[0]
      weekMap.set(weekKey, (weekMap.get(weekKey) || 0) + 1)
    }

    const timeline: TimelineWeek[] = []

    for (const [weekKey, count] of Array.from(weekMap.entries()).slice(0, 12)) {
      const weekStart = new Date(weekKey)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 7)

      // Get notes for this week
      const { data: notes } = await supabaseAdmin
        .from('notes')
        .select(`
          cluster,
          note_tags (
            tags (name)
          )
        `)
        .eq('user_id', userId)
        .gte('created_at', weekStart.toISOString())
        .lt('created_at', weekEnd.toISOString())
        .eq('archived', false)
        .limit(20)

      // Extract unique topics (clusters + tags)
      const topicsSet = new Set<string>()
      for (const note of notes || []) {
        if (note.cluster) topicsSet.add(note.cluster.toLowerCase())
        if (note.note_tags) {
          for (const nt of note.note_tags) {
            if (nt.tags?.name) topicsSet.add(nt.tags.name)
          }
        }
      }

      const topics = Array.from(topicsSet).slice(0, 5)

      timeline.push({
        week: weekKey,
        count,
        topics,
      })
    }

    return timeline.sort((a, b) => b.week.localeCompare(a.week))
  } catch (error) {
    console.error("[v0] Timeline analysis error:", error)
    throw new Error(`Failed to analyze timeline: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
