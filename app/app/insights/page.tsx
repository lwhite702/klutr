"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { InsightCard } from "@/components/insights/InsightCard";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { PageTour } from "@/components/tour/PageTour";
import { HelpCenter } from "@/components/help/HelpCenter";
import { mockInsights } from "@/lib/mockData";

const tourSteps = [
  {
    id: "welcome",
    title: "Welcome to Insights!",
    description: "Get AI-generated summaries of your weekly activity?patterns, trends, and highlights from your notes and ideas.",
  },
  {
    id: "summaries",
    title: "Weekly Summaries",
    description: "Each week, we analyze your notes and surface themes, sentiment, and key topics. It's like having a personal assistant review your thinking.",
  },
  {
    id: "generate",
    title: "Generate On-Demand",
    description: "Hit 'Generate Summary' anytime to create a fresh report. Perfect for tracking project progress or reflecting on your thought patterns.",
  },
];

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
    >
      Generate Summary
    </Button>
  );

  return (
    <AppShell activeRoute="/app/insights">
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader
          title="Weekly Insights"
          description="Highlights from your recent activity."
          actions={<GenerateButton />}
        />

        <SectionSummary
          pageId="insights"
          title="AI-Powered Analytics & Trends"
          description="Insights show you the patterns in your notes over time?themes, sentiment, and interesting connections you might have missed."
          tips={[
            "Summaries are generated automatically each week",
            "Click 'Generate Summary' for on-demand reports",
            "Use insights to track project momentum or personal growth",
          ]}
        />

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

        {insights.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>
              No insights yet. Generate your first weekly summary to get
              started.
            </p>
          </div>
        )}
      </div>

      <PageTour pageId="insights" steps={tourSteps} />
      <HelpCenter />
    </AppShell>
  );
}
