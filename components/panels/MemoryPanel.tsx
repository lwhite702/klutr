'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PanelHeader } from "./PanelContainer"
import { TimelineGrid } from "@/components/memory/TimelineGrid"
import { toast } from "sonner"
import posthog from 'posthog-js'

interface WeeklySummary {
  id: string
  summary: string
  startDate: string
  endDate: string
  noteCount: number
  topTags: string[]
}

/**
 * Memory Panel - Weekly summaries timeline
 * Extracted from /memory page for hybrid architecture
 */
export function MemoryPanel() {
  const [summaries, setSummaries] = useState<WeeklySummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  // Load weekly summaries
  useEffect(() => {
    loadWeeklySummaries()
  }, [])

  async function loadWeeklySummaries() {
    try {
      setIsLoading(true)
      const response = await fetch('/api/weekly-summaries/list?limit=20')
      
      if (!response.ok) {
        throw new Error('Failed to load summaries')
      }
      
      const data = await response.json()
      setSummaries(data.summaries || [])
    } catch (error) {
      console.error('[Memory] Error loading:', error)
      toast.error('Failed to load weekly summaries')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGenerateWeeklySummary() {
    try {
      setIsGenerating(true)
      const response = await fetch('/api/weekly-summaries/generate', {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate summary')
      }
      
      toast.success('Weekly summary generated!')
      await loadWeeklySummaries()
    } catch (error) {
      console.error('[Memory] Generate error:', error)
      toast.error('Failed to generate weekly summary')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRevisitWeek = (week: string) => {
    posthog.capture('memory_week_revisited', { week, source: 'panel' })
    // Find and show the summary for this week
    const summary = summaries.find(s => {
      const startDate = new Date(s.startDate)
      const endDate = new Date(s.endDate)
      const formatted = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
      return formatted === week
    })
    if (summary) {
      toast.info(summary.summary, { duration: 10000 })
    }
  }

  return (
    <div className="h-full flex flex-col">
      <PanelHeader
        title="Memory Lane"
        description="Your note-taking timeline"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateWeeklySummary}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate This Week'}
          </Button>
        }
      />
      
      <ScrollArea className="flex-1">
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">Loading summaries...</p>
            </div>
          ) : summaries.length > 0 ? (
            <div className="space-y-3">
              <TimelineGrid
                items={summaries.map((item) => {
                  const startDate = new Date(item.startDate)
                  const endDate = new Date(item.endDate)
                  return {
                    week: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
                    count: item.noteCount,
                    topics: item.topTags,
                  }
                })}
                onRevisit={handleRevisitWeek}
              />
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">No weekly summaries yet. Add some notes and generate your first summary.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
