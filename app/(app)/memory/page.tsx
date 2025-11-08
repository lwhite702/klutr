"use client";

import { useState, useRef } from "react";
import type React from "react";
import posthog from 'posthog-js';
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { TourCallout } from "@/components/tour/TourCallout";
import { SectionTourDialog } from "@/components/onboarding/SectionTourDialog";
import { useSectionOnboarding } from "@/lib/hooks/useSectionOnboarding";
import { useSectionTour } from "@/lib/hooks/useSectionExperience";
import { getOnboardingSteps, getDialogTourSteps } from "@/lib/onboardingSteps";
import { Button } from "@/components/ui/button";
import { TimelineGrid } from "@/components/memory/TimelineGrid";
import { mockMemory } from "@/lib/mockData";

export default function MemoryLanePage() {
  const [memoryItems, setMemoryItems] = useState(mockMemory);
  const timelineRef = useRef<HTMLDivElement>(null);
  const memoryItemsRef = useRef<HTMLDivElement>(null);

  // Dialog tour for first-time onboarding (auto-starts)
  const dialogTour = useSectionTour("memory", getDialogTourSteps("memory"), {
    autoStart: true,
  });

  // Callout tour for contextual hints (manual trigger)
  const onboarding = useSectionOnboarding({
    section: "memory",
    steps: getOnboardingSteps("memory").map((step, idx) => {
      if (idx === 0)
        return {
          ...step,
          targetRef: timelineRef as React.RefObject<HTMLElement | null>,
        };
      if (idx === 1)
        return {
          ...step,
          targetRef: memoryItemsRef as React.RefObject<HTMLElement | null>,
        };
      return step;
    }),
    autoTrigger: false,
  });

  const handleRevisitWeek = (week: string) => {
    posthog.capture('memory_week_revisited', { week: week });
    console.log("TODO: Open week detail", week);
  };

  const handleMemoryClick = (memoryId: string) => {
    console.log("TODO: Open memory item", memoryId);
  };

  const handleMemoryFavorite = (memoryId: string) => {
    console.log("TODO: Toggle favorite for memory", memoryId);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader
          title="Memory Lane"
          description="What you were thinking across time."
          actions={
            !onboarding.active && !dialogTour.open && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  posthog.capture('memory_tour_started', { trigger: 'manual_click' });
                  dialogTour.startTour();
                }}
              >
                Take tour
              </Button>
            )
          }
        />

        <SectionTourDialog
          title="Welcome to Memory Lane"
          subtitle="Your note-taking timeline. Rediscover forgotten ideas"
          accent="lime"
          tour={dialogTour}
        />

        <SectionSummary
          section="memory"
          summary="Your note-taking timeline. Rediscover forgotten ideas and see what you were thinking across time."
        />

        <div ref={timelineRef} data-onboarding="timeline" className="relative">
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

        {/* Use existing TimelineGrid component if available, otherwise fall back to CardGrid */}
        <div
          ref={memoryItemsRef}
          data-onboarding="memory-items"
          className="relative"
        >
          {onboarding.active &&
            onboarding.currentStep &&
            onboarding.step === 1 && (
              <TourCallout
                title={onboarding.currentStep.title}
                description={onboarding.currentStep.description}
                position={onboarding.currentStep.position}
                onNext={onboarding.nextStep}
                onClose={onboarding.endOnboarding}
                showNext={!onboarding.isLastStep}
              />
            )}
          <TimelineGrid
            items={memoryItems.map((item) => ({
              week: item.period,
              count: 1,
              topics: item.tags.map((tag) => tag.label),
            }))}
            onRevisit={handleRevisitWeek}
          />
        </div>

        {memoryItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No memories yet. Add some notes to see your timeline.</p>
          </div>
        )}
      </div>
  );
}
