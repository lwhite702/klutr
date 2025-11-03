"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { InsightCard } from "@/components/insights/InsightCard";
import { mockInsights } from "@/lib/mockData";
import { SectionSummary } from "@/components/onboarding/SectionSummary";
import { useSectionTour, type TourStep } from "@/lib/hooks/useSectionExperience";
import { SectionTourDialog } from "@/components/onboarding/SectionTourDialog";

const INSIGHTS_TOUR_STEPS: TourStep[] = [
  {
    id: "weekly",
    title: "Pulse check",
    description: "Weekly Insights auto-generate summaries on Sunday. You can trigger one anytime with Generate Summary.",
  },
  {
    id: "cards",
    title: "Read the signal",
    description: "Each insight card calls out patterns, highlights sentiment, and links to the underlying notes.",
  },
  {
    id: "act",
    title: "Act on it",
    description: "Use what you learn to adjust stacks, schedule follow-ups, or create new MindStorm prompts.",
  },
];

export default function InsightsPage() {
  const [insights, setInsights] = useState(mockInsights);
  const insightsTour = useSectionTour("insights", INSIGHTS_TOUR_STEPS);

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
      <>
        <div className="mx-auto flex max-w-5xl flex-col space-y-6">
          <SectionSummary
            sectionId="summary.insights"
            title="Insights quick tour"
            description="Here's where Klutr crunches your activity into digestible takeaways so you can steer with data."
            highlights={[
              "Automatic weekly rollups keep your finger on the pulse.",
              "Sentiment highlights help you spot momentum or friction.",
              "Use the summaries to adjust your plan or spark new storms.",
            ]}
            onStartTour={() => insightsTour.startTour({ restart: true })}
            tourCompleted={insightsTour.completed}
            accent="coral"
          />

          <PageHeader
            title="Weekly Insights"
            description="Highlights from your recent activity."
            actions={<GenerateButton />}
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
            <div className="py-12 text-center text-muted-foreground">
              <p>
                No insights yet. Generate your first weekly summary to get
                started.
              </p>
            </div>
          )}
        </div>

        <SectionTourDialog title="Insights walkthrough" accent="coral" tour={insightsTour} />
      </>
    </AppShell>
  );
}
