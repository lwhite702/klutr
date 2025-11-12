"use client";

import { useState, useRef, useEffect } from "react";
import type React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { TourCallout } from "@/components/tour/TourCallout";
import { SectionTourDialog } from "@/components/onboarding/SectionTourDialog";
import { useSectionOnboarding } from "@/lib/hooks/useSectionOnboarding";
import { useSectionTour } from "@/lib/hooks/useSectionExperience";
import { getOnboardingSteps, getDialogTourSteps } from "@/lib/onboardingSteps";
import { Button } from "@/components/ui/button";
import { InsightCard } from "@/components/insights/InsightCard";
import { toast } from "sonner";

interface Insight {
  id: string;
  title: string;
  description: string;
  type: string;
  relevance?: string;
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const insightsRef = useRef<HTMLDivElement>(null);
  const generateButtonRef = useRef<HTMLButtonElement>(null);

  // Dialog tour for first-time onboarding (auto-starts)
  const dialogTour = useSectionTour("insights", getDialogTourSteps("insights"), {
    autoStart: true,
  });

  // Callout tour for contextual hints (manual trigger)
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
    autoTrigger: false,
  });

  // Load insights on mount
  useEffect(() => {
    loadInsights();
  }, []);

  async function loadInsights() {
    try {
      setIsLoading(true);
      const response = await fetch('/api/insights/generate');
      
      if (!response.ok) {
        throw new Error('Failed to load insights');
      }
      
      const data = await response.json();
      setInsights(data.insights || []);
    } catch (error) {
      console.error('[Insights] Error loading:', error);
      // Don't show error on initial load - just show empty state
    } finally {
      setIsLoading(false);
    }
  }

  const handleGenerateSummary = async () => {
    try {
      setIsGenerating(true);
      const response = await fetch('/api/insights/generate', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }
      
      const data = await response.json();
      setInsights(data.insights || []);
      toast.success('Insights generated successfully!');
    } catch (error) {
      console.error('[Insights] Generate error:', error);
      toast.error('Failed to generate insights. Try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInsightClick = (insightId: string) => {
    // Navigate to related notes or cluster
    toast.info('Insight details coming soon');
  };

  const GenerateButton = () => (
    <Button
      ref={generateButtonRef}
      variant="outline"
      size="sm"
      onClick={handleGenerateSummary}
      disabled={isGenerating}
      aria-label="Generate weekly summary"
      data-onboarding="generate-button"
      className="relative"
    >
      {isGenerating ? 'Generating...' : 'Generate Summary'}
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
    <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader
          title="Weekly Insights"
          description="Highlights from your recent activity."
          actions={
            <>
              {!onboarding.active && !dialogTour.open && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dialogTour.startTour()}
                >
                  Take tour
                </Button>
              )}
              <GenerateButton />
            </>
          }
        />

        <SectionTourDialog
          title="Welcome to Insights"
          subtitle="Weekly summaries highlight patterns in your thinking"
          accent="indigo"
          tour={dialogTour}
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
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Loading insights...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {insights.map((insight) => (
                <InsightCard
                  key={insight.id}
                  week={insight.title}
                  summary={insight.description}
                  sentiment={insight.type || "mixed"}
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
          </>
        )}
      </div>
  );
}
