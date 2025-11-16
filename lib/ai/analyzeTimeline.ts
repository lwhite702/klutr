import { prisma } from "../db";
import { supabaseAdmin } from "../supabase";

export type TimelineWeek = {
  week: string;
  count: number;
  topics: string[];
};

export async function analyzeTimeline(userId: string): Promise<TimelineWeek[]> {
  try {
    // Get weekly note counts for the past 12 weeks
    const twelveWeeksAgo = new Date();
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);

    // Generate 12 week periods
    const weeks: Date[] = [];
    for (let i = 0; i < 12; i++) {
      const weekStart = new Date(twelveWeeksAgo);
      weekStart.setDate(twelveWeeksAgo.getDate() + i * 7);
      weeks.push(weekStart);
    }

    const timeline: TimelineWeek[] = [];

    // Query notes for each week
    for (const weekStart of weeks) {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      // Get notes for this week using Supabase
      const { data: notesData, error: notesError } = await supabaseAdmin
        .from("notes")
        .select(
          `
          id,
          cluster,
          note_tags (
            tag:tags (
              name
            )
          )
        `
        )
        .eq("user_id", userId)
        .eq("archived", false)
        .gte("created_at", weekStart.toISOString())
        .lt("created_at", weekEnd.toISOString())
        .limit(20);

      if (notesError) {
        console.warn(
          `[analyzeTimeline] Error fetching notes for week ${weekStart.toISOString()}:`,
          notesError
        );
        continue;
      }

      const notes = notesData || [];
      const count = notes.length;

      // Extract unique topics (clusters + tags)
      const topicsSet = new Set<string>();
      for (const note of notes) {
        if (note.cluster) topicsSet.add(note.cluster.toLowerCase());
        const noteTags = (note.note_tags || []) as unknown as Array<{
          tag?: { name: string };
        }>;
        for (const nt of noteTags) {
          const tagName = nt.tag?.name;
          if (tagName) topicsSet.add(tagName);
        }
      }

      const topics = Array.from(topicsSet).slice(0, 5);

      timeline.push({
        week: weekStart.toISOString().split("T")[0],
        count,
        topics,
      });
    }

    return timeline;
  } catch (error) {
    console.error("[v0] Timeline analysis error:", error);
    throw new Error(
      `Failed to analyze timeline: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
