"use client";

import { useState, useRef } from "react";
import type React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { TourCallout } from "@/components/tour/TourCallout";
import { useSectionOnboarding } from "@/lib/hooks/useSectionOnboarding";
import { getOnboardingSteps } from "@/lib/onboardingSteps";
import { Button } from "@/components/ui/button";
import { mockStacks } from "@/lib/mockData";

export default function SmartStacksPage() {
  const [stacks, setStacks] = useState(mockStacks);
  const stacksRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  const onboarding = useSectionOnboarding({
    section: "stacks",
    steps: getOnboardingSteps("stacks").map((step, idx) => {
      if (idx === 0)
        return {
          ...step,
          targetRef: stacksRef as React.RefObject<HTMLElement | null>,
        };
      if (idx === 1)
        return {
          ...step,
          targetRef: tagsRef as React.RefObject<HTMLElement | null>,
        };
      return step;
    }),
  });

  const handleStackClick = (stackName: string) => {
    console.log("TODO: Navigate to stack detail", stackName);
    // For now, navigate to a mock stack detail page
    window.location.href = `/app/stacks/${stackName
      .toLowerCase()
      .replace(/\s+/g, "-")}`;
  };

  const handleStackFavorite = (stackId: string) => {
    console.log("TODO: Toggle favorite for stack", stackId);
    setStacks(
      stacks.map((stack) =>
        stack.id === stackId ? { ...stack, pinned: !stack.pinned } : stack
      )
    );
  };

  return (
    <AppShell activeRoute="/app/stacks">
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader
          title="Stacks"
          description="Your saved collections."
          actions={
            !onboarding.active && (
              <Button
                variant="outline"
                size="sm"
                onClick={onboarding.startOnboarding}
              >
                Take tour
              </Button>
            )
          }
        />

        <SectionSummary
          section="stacks"
          summary="Collections of related notes organized by tags and categories. Pin important stacks for quick access."
        />

        <div ref={stacksRef} data-onboarding="stacks" className="relative">
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

        <div ref={tagsRef} data-onboarding="tags" className="relative">
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
        </div>

        <CardGrid>
          {stacks.map((stack) => (
            <ItemCard
              key={stack.id}
              title={stack.name}
              description={stack.description}
              tags={stack.tags}
              pinned={stack.pinned}
              onClick={() => handleStackClick(stack.name)}
              onFavorite={() => handleStackFavorite(stack.id)}
            />
          ))}
        </CardGrid>

        {onboarding.active &&
          onboarding.currentStep &&
          onboarding.step === 2 && (
            <div className="relative" data-onboarding="pin-button">
              <TourCallout
                title={onboarding.currentStep.title}
                description={onboarding.currentStep.description}
                position={onboarding.currentStep.position}
                onNext={onboarding.nextStep}
                onClose={onboarding.endOnboarding}
                showNext={!onboarding.isLastStep}
              />
            </div>
          )}

        {stacks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>
              No stacks yet. Create some notes and run "Re-cluster now" to
              generate stacks.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
