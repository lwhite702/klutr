"use client"

import { AppShell } from "@/components/AppShell"
import { StackCard } from "@/components/StackCard"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"

const MOCK_STACKS = [
  { title: "Podcast Ideas", count: 7, summary: "Creator economy + AI clips. Guests and formats.", pinned: false },
  { title: "2025 Goals", count: 3, summary: "Saving, product, time freedom. Sustainable growth.", pinned: true },
  { title: "Client Work", count: 5, summary: "Follow-ups, deliverables, deadlines, project notes.", pinned: false },
  { title: "Learning Resources", count: 12, summary: "Courses and articles on AI and web dev.", pinned: false },
]

export default function SmartStacksPage() {
  return (
    <AppShell activeRoute="/app/stacks" showDemoBadge>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Stacks</h1>
            <p className="text-muted-foreground">Curated collections of related notes.</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Stacks are like playlists for your ideas.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {MOCK_STACKS.map((s) => (
            <StackCard key={s.title} title={s.title} count={s.count} summary={s.summary} pinned={s.pinned} />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
