"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/AppShell"
import { TimelineGrid } from "@/components/memory/TimelineGrid"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { NoteCard } from "@/components/notes/NoteCard"
import { apiGet } from "@/lib/clientApi"
import { isDemoMode } from "@/lib/onboarding"
import type { NoteDTO } from "@/types/note"
import { HelpCircle } from "lucide-react"

const MOCK_TIMELINE = [
  { week: "2025-10-20", count: 12, topics: ["AI", "pricing", "founder anxiety"] },
  { week: "2025-10-13", count: 7, topics: ["clients", "burnout"] },
  { week: "2025-10-06", count: 15, topics: ["automation", "productivity", "AI"] },
  { week: "2025-09-29", count: 9, topics: ["family", "work-life balance"] },
  { week: "2025-09-22", count: 11, topics: ["SaaS ideas", "validation"] },
  { week: "2025-09-15", count: 8, topics: ["networking", "conferences"] },
  { week: "2025-09-08", count: 14, topics: ["content creation", "podcast"] },
  { week: "2025-09-01", count: 6, topics: ["learning", "courses"] },
  { week: "2025-08-25", count: 10, topics: ["client work", "deadlines"] },
]

interface TimelineItem {
  week: string
  count: number
  topics: string[]
}

export default function MemoryLanePage() {
  const [filterType, setFilterType] = useState<string>("all")
  const [timeline, setTimeline] = useState<TimelineItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null)
  const [weekNotes, setWeekNotes] = useState<NoteDTO[]>([])
  const [isLoadingWeek, setIsLoadingWeek] = useState(false)
  const demoMode = isDemoMode()

  useEffect(() => {
    async function loadTimeline() {
      if (demoMode) {
        setTimeline(MOCK_TIMELINE)
        setIsLoading(false)
        return
      }

      try {
        const data = await apiGet<TimelineItem[]>("/api/memory/activity")
        setTimeline(data)
      } catch (error) {
        console.error("[v0] Failed to load timeline:", error)
        setTimeline(MOCK_TIMELINE)
      } finally {
        setIsLoading(false)
      }
    }

    loadTimeline()
  }, [demoMode])

  const handleRevisitWeek = async (week: string) => {
    setSelectedWeek(week)

    if (demoMode) {
      console.log("[v0] Demo mode: open week detail for", week)
      setWeekNotes([
        {
          id: "1",
          content: "Example note from this week",
          type: "idea",
          archived: false,
          createdAt: new Date(week).toISOString(),
          tags: ["example"],
          cluster: "Ideas",
          clusterConfidence: 0.9,
          clusterUpdatedAt: new Date().toISOString(),
        },
      ])
      return
    }

    setIsLoadingWeek(true)
    try {
      const data = await apiGet<NoteDTO[]>(`/api/memory/notes-by-week?week=${week}`)
      setWeekNotes(data)
    } catch (error) {
      console.error("[v0] Failed to load week notes:", error)
    } finally {
      setIsLoadingWeek(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <AppShell activeRoute="/app/memory">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Memory Lane</h1>
              <p className="text-muted-foreground">Travel back through your captured thoughts.</p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">See how your brain changes over time. Track themes across weeks.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="ideas">Ideas</SelectItem>
              <SelectItem value="tasks">Tasks</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TimelineGrid items={timeline} onRevisit={handleRevisitWeek} />

        {/* Week Detail Sheet */}
        <Sheet open={!!selectedWeek} onOpenChange={(open) => !open && setSelectedWeek(null)}>
          <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Week of {selectedWeek}</SheetTitle>
              <SheetDescription>{weekNotes.length} notes from this week</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              {isLoadingWeek ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-24 bg-muted rounded" />
                  <div className="h-24 bg-muted rounded" />
                </div>
              ) : (
                weekNotes.map((note) => <NoteCard key={note.id} note={note} />)
              )}
              {!isLoadingWeek && weekNotes.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No notes found for this week.</p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </AppShell>
  )
}
