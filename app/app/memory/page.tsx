"use client"

import { AppShell } from "@/components/AppShell"
import { TimelineGrid, type TimelineWeek } from "@/components/TimelineGrid"

const MOCK_TIMELINE: TimelineWeek[] = [
  { weekLabel: "Oct 20–26", count: 12, topics: ["AI", "pricing", "anxiety"] },
  { weekLabel: "Oct 13–19", count: 7, topics: ["clients", "burnout"] },
  { weekLabel: "Oct 6–12", count: 15, topics: ["automation", "productivity", "AI"] },
]

export default function MemoryLanePage() {
  return (
    <AppShell activeRoute="/app/memory" showDemoBadge>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Memory Lane</h1>
          <p className="text-muted-foreground">Travel back through your captured thoughts.</p>
        </div>

        <TimelineGrid weeks={MOCK_TIMELINE} />
      </div>
    </AppShell>
  )
}
