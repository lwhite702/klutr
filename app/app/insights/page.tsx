"use client";

import { useState, useRef } from "react";
import type React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { TourCallout } from "@/components/tour/TourCallout";
import { useSectionOnboarding } from "@/lib/hooks/useSectionOnboarding";
import { getOnboardingSteps } from "@/lib/onboardingSteps";
import { Button } from "@/components/ui/button";
import { InsightCard } from "@/components/insights/InsightCard";
import { mockInsights } from "@/lib/mockData";

export default function InsightsPage() {
  const [insights, setInsights] = useState(mockInsights);
  const insightsRef = useRef<HTMLDivElement>(null);
  const generateButtonRef = useRef<HTMLButtonElement>(null);

  const onboarding = useSectionOnboarding({
    section: "insights",
    steps: getOnboardingSteps("insights").map((step, idx) => {
      if (idx === 0)
        return {
          ...step,
          targetRef: insightsRef as React.RefObject<HTMLElement | null>,
        };
      if (idx === 1)
        return {
          ...step,
          targetRef: generateButtonRef as React.RefObject<HTMLElement | null>,
        };
      return step;
    }),
  });

  const handleGenerateSummary = () => {
    console.log("TODO: Generate weekly summary");
  };

  const handleInsightClick = (insightId: string) => {
    console.log("TODO: Open insight", insightId);
  };

  const GenerateButton = () => (
    <Button
      ref={generateButtonRef}
      variant="outline"
      size="sm"
      onClick={handleGenerateSummary}
      aria-label="Generate weekly summary"
      data-onboarding="generate-button"
      className="relative"
    >
      Generate Summary
      {onboarding.active && onboarding.currentStep && onboarding.step === 1 && (
        <TourCallout
          title={onboarding.currentStep.title}
          description={onboarding.currentStep.description}
          position={onboarding.currentStep.position}
          onNext={onboarding.nextStep}
          onClose={onboarding.endOnboarding}
          showNext={!onboarding.isLastStep}
        />
      )}
    </Button>
  );

  return (
    <AppShell activeRoute="/app/insights">
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader
          title="Weekly Insights"
          description="Highlights from your recent activity."
          actions={
            <>
              {!onboarding.active && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onboarding.startOnboarding}
                >
                  Take tour
                </Button>
              )}
              <GenerateButton />
            </>
          }
        />

        <SectionSummary
          section="insights"
          summary="Weekly summaries highlight patterns in your thinking. See trends and themes across your notes."
        />

        <div ref={insightsRef} data-onboarding="insights" className="relative">
          {onboarding.active &&
            onboarding.currentStep &&
            onboarding.step === 0 && (
              <TourCallout
                title={onboarding.currentStep.title}
                description={onboarding.currentStep.description}
                position={onboarding.currentStep.position}
                onNext={onboarding.nextStep}
                onClose={onboarding.endOnboarding}
                showNext={!onboarding.isLastStep}
              />
            )}
        </div>

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
