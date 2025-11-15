'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PanelHeader } from "./PanelContainer"
import { InsightCard } from "@/components/insights/InsightCard"
import { toast } from "sonner"

interface Insight {
  id: string
  title: string
  description: string
  type: string
  relevance?: string
}

/**
 * Insights Panel - AI-generated insights from notes
 * Extracted from /insights page for hybrid architecture
 */
export function InsightsPanel() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // Load insights on mount
  useEffect(() => {
    loadInsights()
  }, [])

  async function loadInsights() {
    try {
      setIsLoading(true)
      const response = await fetch('/api/insights/generate')
      
      if (!response.ok) {
        throw new Error('Failed to load insights')
      }
      
      const data = await response.json()
      setInsights(data.insights || [])
    } catch (error) {
      console.error('[Insights] Error loading:', error)
      // Don't show error on initial load - just show empty state
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerate = async () => {
    try {
      setIsGenerating(true)
      const response = await fetch('/api/insights/generate', {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate insights')
      }
      
      const data = await response.json()
      setInsights(data.insights || [])
      toast.success('Insights generated successfully!')
    } catch (error) {
      console.error('[Insights] Generate error:', error)
      toast.error('Failed to generate insights. Try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <PanelHeader
        title="Insights"
        description="AI-generated patterns from your notes"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </Button>
        }
      />
      
      <ScrollArea className="flex-1">
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">Loading insights...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {insights.map((insight) => (
                <InsightCard
                  key={insight.id}
                  week={insight.title}
                  summary={insight.description}
                  sentiment={insight.type || "mixed"}
                />
              ))}
              
              {insights.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-sm">No insights yet. Generate your first insights to get started.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
