"use client"

import { AppShell } from "@/components/AppShell"
import { InsightCard } from "@/components/InsightCard"
import { Button } from "@/components/ui/button"

const MOCK_INSIGHTS = [
  {
    weekRange: "Oct 20–26",
    summary:
      "You're thinking a lot about burnout vs freedom. Notes about escaping client work and building sustainable income.",
    mood: "mixed",
  },
  {
    weekRange: "Oct 13–19",
    summary:
      "Theme: build a product to exit client work. Several SaaS ideas; researching pricing and validation.",
    mood: "determined",
  },
]

export default function InsightModePage() {
  return (
    <AppShell activeRoute="/app/insights" showDemoBadge>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Insights</h1>
            <p className="text-muted-foreground">AI-powered analysis of your thinking patterns.</p>
          </div>
          <Button variant="outline" onClick={() => console.log("Generate Weekly Summary")}>Generate Weekly Summary</Button>
        </div>

        <div className="space-y-4">
          {MOCK_INSIGHTS.map((i) => (
            <InsightCard key={i.weekRange} weekRange={i.weekRange} summary={i.summary} mood={i.mood} />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
