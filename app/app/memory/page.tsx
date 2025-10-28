"use client"

import { AppShell } from "@/components/layout/AppShell"
import { TimelineGrid } from "@/components/memory/TimelineGrid"

// Mock data for timeline
const mockWeeks = [
  {
    weekLabel: "Week of Jan 15, 2024",
    count: 8,
    topics: ["React", "TypeScript", "Performance", "Work"]
  },
  {
    weekLabel: "Week of Jan 8, 2024",
    count: 12,
    topics: ["Learning", "Web Development", "Meeting Notes", "Coffee"]
  },
  {
    weekLabel: "Week of Jan 1, 2024",
    count: 6,
    topics: ["New Year", "Goals", "Planning", "Health"]
  },
  {
    weekLabel: "Week of Dec 25, 2023",
    count: 4,
    topics: ["Holiday", "Family", "Reflection", "Books"]
  },
  {
    weekLabel: "Week of Dec 18, 2023",
    count: 15,
    topics: ["Work", "Deadlines", "Projects", "Team"]
  },
  {
    weekLabel: "Week of Dec 11, 2023",
    count: 9,
    topics: ["Creative", "Ideas", "Side Projects", "Innovation"]
  },
  {
    weekLabel: "Week of Dec 4, 2023",
    count: 7,
    topics: ["Learning", "Tutorials", "Code", "Design"]
  },
  {
    weekLabel: "Week of Nov 27, 2023",
    count: 11,
    topics: ["Travel", "Recommendations", "Personal", "Health"]
  },
  {
    weekLabel: "Week of Nov 20, 2023",
    count: 5,
    topics: ["Work", "Meetings", "Planning", "Strategy"]
  }
]

export default function MemoryPage() {
  return (
    <AppShell activeRoute="/app/memory">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Memory Lane</h1>
          <p className="text-muted-foreground">A timeline of your thoughts and experiences</p>
        </div>
        
        <TimelineGrid weeks={mockWeeks} />
      </div>
    </AppShell>
  )
}