"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { Button } from "@/components/ui/button";
import { InsightCard } from "@/components/insights/InsightCard";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { SectionTour } from "@/components/tour/SectionTour";
import { mockInsights } from "@/lib/mockData";

export default function InsightsPage() {
  const [insights, setInsights] = useState(mockInsights);

  const handleGenerateSummary = () => {
    console.log("TODO: Generate weekly summary");
  };

  const handleInsightClick = (insightId: string) => {
    console.log("TODO: Open insight", insightId);
  };

  const GenerateButton = () => (
    <Button
      variant="outline"
      size="sm"
      onClick={handleGenerateSummary}
      aria-label="Generate weekly summary"
      id="generate-summary-button"
    >
      Generate Summary
    </Button>
  );

  const tourSteps = [
    {
      id: "insights-patterns",
      targetId: "insights-content",
      title: "Viewing Patterns",
      description: "Insights show you trends in your note-taking, including what topics you focus on most and when you're most active.",
      position: "bottom" as const,
    },
    {
      id: "generate-summary",
      targetId: "generate-summary-button",
      title: "Weekly Summaries",
      description: "Click 'Generate Summary' to create a weekly digest of your activity. This helps you see the bigger picture of your thoughts.",
      position: "bottom" as const,
    },
  ];

  return (
    <AppShell activeRoute="/app/insights">
      <SectionTour section="insights" steps={tourSteps} autoStart={true} />
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader
          title="Weekly Insights"
          description="Highlights from your recent activity."
          actions={<GenerateButton />}
        />

        <SectionSummary
          title="Analytics & Trends"
          description="Insights show patterns in your note-taking, including what topics you focus on most and when you're most active. Generate weekly summaries to see the bigger picture of your thoughts and discover what matters most to you over time."
          storageKey="insights"
        />

        <div id="insights-content">
          {/* Use existing InsightCard component if available, otherwise fall back to ItemCard */}
          <div className="space-y-4">
            {insights.map((insight) => (
              <InsightCard
                key={insight.id}
                week={insight.title}
                summary={insight.description}
                sentiment={insight.tags[0]?.label || "mixed"}
              />
            ))}
          </div>
        </div>

        {insights.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>
              No insights yet. Generate your first weekly summary to get
              started.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
