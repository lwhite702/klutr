"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AppShell } from "@/components/layout/AppShell"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InsightCard } from "@/components/insights/InsightCard"
import { apiGet, apiPost } from "@/lib/clientApi"
import { isDemoMode } from "@/lib/onboarding"
import { Loader2 } from "lucide-react"

const MOCK_INSIGHTS = [
  {
    week: "Oct 20–26",
    summary:
      "You're thinking a lot about burnout vs freedom. Multiple notes about escaping client work and building sustainable income. Strong desire for autonomy.",
    sentiment: "mixed",
  },
  {
    week: "Oct 13–19",
    summary:
      "Recurring theme: building a product to exit client work. Several SaaS ideas captured. You're researching pricing models and validation strategies.",
    sentiment: "determined",
  },
  {
    week: "Oct 6–12",
    summary:
      "Heavy focus on AI and automation. Exploring how to use AI to scale personal productivity. Lots of saved articles and tutorials.",
    sentiment: "positive",
  },
  {
    week: "Sep 29–Oct 5",
    summary:
      "Reflection on work-life balance. Notes about spending more time with family and less time on low-value client work. Some anxiety about financial stability.",
    sentiment: "reflective",
  },
]

interface Insight {
  week: string
  summary: string
  sentiment: string
}

export default function InsightModePage() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const demoMode = isDemoMode()

  useEffect(() => {
    async function loadInsights() {
      if (demoMode) {
        setInsights(MOCK_INSIGHTS)
        setIsLoading(false)
        return
      }

      try {
        const data = await apiGet<Insight[]>("/api/insights/list")
        setInsights(data)
      } catch (error) {
        console.error("[v0] Failed to load insights:", error)
        // Fallback to mock data
        setInsights(MOCK_INSIGHTS)
      } finally {
        setIsLoading(false)
      }
    }

    loadInsights()
  }, [demoMode])

  const handleGenerateSummary = async () => {
    if (demoMode) {
      console.log("[v0] Demo mode: pretend generate summary")
      return
    }

    setIsGenerating(true)
    try {
      const newInsight = await apiPost<Insight>("/api/insights/generate")
      // Prepend new insight to list
      setInsights([newInsight, ...insights])
    } catch (error) {
      console.error("[v0] Failed to generate insight:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-32 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    )
  }

  return (
    <AppShell activeRoute="/app/insights">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Insights</h1>
            <p className="text-muted-foreground">AI-powered analysis of your thinking patterns.</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={handleGenerateSummary} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Weekly Summary"
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  We analyze your last 7 days of notes and generate a private reflection. Nothing is shared.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {insights.map((insight) => (
              <motion.div
                key={insight.week}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.15 }}
              >
                <InsightCard week={insight.week} summary={insight.summary} sentiment={insight.sentiment} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {insights.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No insights yet. Generate your first weekly summary to get started.</p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
