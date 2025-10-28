"use client"

import { AppShell } from "@/components/layout/AppShell"
import { InsightCard } from "@/components/insights/InsightCard"

// Mock data for insights
const mockInsights = [
  {
    weekRange: "Jan 8 - Jan 14, 2024",
    summary: "This week you focused heavily on web development topics, with 8 notes about React and TypeScript. Your productivity peaked mid-week, and you showed particular interest in performance optimization techniques.",
    mood: "positive"
  },
  {
    weekRange: "Jan 1 - Jan 7, 2024",
    summary: "A balanced week with notes spanning work projects, personal learning, and creative ideas. You explored new concepts in AI and machine learning, showing curiosity about emerging technologies.",
    mood: "neutral"
  },
  {
    weekRange: "Dec 25 - Dec 31, 2023",
    summary: "Holiday week with lighter note-taking activity. Focus shifted to personal reflection, family time, and planning for the new year. Several notes about goal-setting and personal growth.",
    mood: "positive"
  },
  {
    weekRange: "Dec 18 - Dec 24, 2023",
    summary: "End-of-year work sprint with many meeting notes and project deadlines. High stress indicators in your notes, but also good problem-solving and team collaboration themes.",
    mood: "negative"
  },
  {
    weekRange: "Dec 11 - Dec 17, 2023",
    summary: "Creative week with many brainstorming sessions and side project ideas. Strong focus on innovation and exploring new technologies. Several notes about potential business opportunities.",
    mood: "positive"
  }
]

export default function InsightsPage() {
  return (
    <AppShell activeRoute="/app/insights">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Insights</h1>
          <p className="text-muted-foreground">Weekly summaries of your note-taking patterns</p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Weekly Insights</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {mockInsights.map((insight, index) => (
              <InsightCard
                key={index}
                weekRange={insight.weekRange}
                summary={insight.summary}
                mood={insight.mood}
              />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}