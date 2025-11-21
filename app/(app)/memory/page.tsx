"use client";

import { useState, useRef, useEffect } from "react";
import type React from "react";
import posthog from 'posthog-js';
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { TourCallout } from "@/components/tour/TourCallout";
import { SectionTourDialog } from "@/components/onboarding/SectionTourDialog";
import { useSectionOnboarding } from "@/lib/hooks/useSectionOnboarding";
import { useSectionTour } from "@/lib/hooks/useSectionExperience";
import { getOnboardingSteps, getDialogTourSteps } from "@/lib/onboardingSteps";
import { Button } from "@/components/ui/button";
import { TimelineGrid } from "@/components/memory/TimelineGrid";
import { toast } from "sonner";

interface WeeklySummary {
  id: string;
  summary: string;
  startDate: string;
  endDate: string;
  noteCount: number;
  topTags: string[];
}

export default function MemoryLanePage() {
  const [memoryItems, setMemoryItems] = useState<WeeklySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
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

  // Load weekly summaries
  useEffect(() => {
    loadWeeklySummaries();
  }, []);

  async function loadWeeklySummaries() {
    try {
      setIsLoading(true);
      const response = await fetch('/api/weekly-summaries/list?limit=20');

      if (!response.ok) {
        throw new Error('Failed to load summaries');
      }

      const data = await response.json();
      setMemoryItems(data.summaries || []);
    } catch (error) {
      console.error('[Memory] Error loading:', error);
      toast.error('Failed to load weekly summaries');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGenerateWeeklySummary() {
    try {
      setIsGenerating(true);
      const response = await fetch('/api/weekly-summaries/generate', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      toast.success('Weekly summary generated!');
      await loadWeeklySummaries();
    } catch (error) {
      console.error('[Memory] Generate error:', error);
      toast.error('Failed to generate weekly summary');
    } finally {
      setIsGenerating(false);
    }
  }

  const handleRevisitWeek = (week: string) => {
    posthog.capture('memory_week_revisited', { week: week });
    // Find and show the summary for this week
    const summary = memoryItems.find(s => s.id === week);
    if (summary) {
      toast.info(summary.summary, { duration: 10000 });
    }
  };



  return (
    <AppShell activeRoute="/app/memory">
      <div className="max-w-[1100px] mx-auto space-y-6">
        <PageHeader
          title="Memory Lane"
          description="What you were thinking across time."
          actions={
            <>
              {!onboarding.active && !dialogTour.open && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    posthog.capture('memory_tour_started', { trigger: 'manual_click' });
                    dialogTour.startTour();
                  }}
                  className="rounded-lg"
                >
                  Take tour
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateWeeklySummary}
                disabled={isGenerating}
                className="rounded-lg"
              >
                {isGenerating ? 'Generating...' : 'Generate This Week'}
              </Button>
            </>
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
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">Loading summaries...</p>
            </div>
          ) : memoryItems.length > 0 ? (
            <TimelineGrid
              items={memoryItems.map((item) => {
                const startDate = new Date(item.startDate);
                const endDate = new Date(item.endDate);
                return {
                  week: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
                  count: item.noteCount,
                  topics: item.topTags,
                };
              })}
              onRevisit={(week) => {
                // Find the summary by its formatted week string
                const idx = memoryItems.findIndex(item => {
                  const startDate = new Date(item.startDate);
                  const endDate = new Date(item.endDate);
                  const formatted = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
                  return formatted === week;
                });
                if (idx >= 0) {
                  handleRevisitWeek(memoryItems[idx].id);
                }
              }}
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">No weekly summaries yet. Add some notes and generate your first summary.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
