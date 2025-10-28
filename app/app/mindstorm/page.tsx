"use client"

import { AppShell } from "@/components/AppShell"
import { StackCard } from "@/components/StackCard"
import { Button } from "@/components/ui/button"

const MOCK_CLUSTERS = [
  { title: "Ideas", count: 5, summary: "Exploring content ideas and side hustles. Focus on AI tools." },
  { title: "Tasks", count: 8, summary: "Client follow-ups and personal todos. Several urgent." },
  { title: "Contacts", count: 12, summary: "Founders, developers, and collaborators from recent conferences." },
  { title: "Links", count: 15, summary: "Saved articles on productivity, AI, and startup advice." },
]

export default function MindStormPage() {
  return (
    <AppShell activeRoute="/app/mindstorm" showDemoBadge>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">MindStorm</h1>
            <p className="text-muted-foreground">Your thoughts, clustered into living themes.</p>
          </div>
          <Button variant="outline" onClick={handleRecluster}>Re-cluster now</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {MOCK_CLUSTERS.map((c) => (
            <StackCard key={c.title} title={c.title} count={c.count} summary={c.summary} />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
