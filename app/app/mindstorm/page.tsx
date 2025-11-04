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
import { mockClusters } from "@/lib/mockData";

export default function MindStormPage() {
  const [clusters, setClusters] = useState(mockClusters);
  const clustersRef = useRef<HTMLDivElement>(null);
  const reclusterButtonRef = useRef<HTMLButtonElement>(null);

  const onboarding = useSectionOnboarding({
    section: "mindstorm",
    steps: getOnboardingSteps("mindstorm").map((step, idx) => {
      if (idx === 0)
        return {
          ...step,
          targetRef: clustersRef as React.RefObject<HTMLElement | null>,
        };
      if (idx === 1)
        return {
          ...step,
          targetRef: reclusterButtonRef as React.RefObject<HTMLElement | null>,
        };
      return step;
    }),
  });

  const handleRecluster = () => {
    console.log("TODO: Recluster notes");
  };

  const handleClusterClick = (clusterId: string) => {
    console.log("TODO: Open cluster", clusterId);
  };

  const handleClusterFavorite = (clusterId: string) => {
    console.log("TODO: Toggle favorite for cluster", clusterId);
  };

  const ReclusterButton = () => (
    <Button
      ref={reclusterButtonRef}
      variant="outline"
      size="sm"
      onClick={handleRecluster}
      aria-label="Re-cluster notes now"
      data-onboarding="recluster-button"
      className="relative"
    >
      Re-cluster now
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
    <AppShell activeRoute="/app/mindstorm" showDemoBadge={true}>
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader
          title="MindStorm"
          description="Your thoughts grouped by theme."
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
              <ReclusterButton />
            </>
          }
        />

        <SectionSummary
          section="mindstorm"
          summary="AI groups your notes by theme automatically. Related ideas cluster together as you add more notes."
        />

        <div ref={clustersRef} data-onboarding="clusters" className="relative">
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

        <CardGrid>
          {clusters.map((cluster) => (
            <ItemCard
              key={cluster.id}
              title={cluster.title}
              description={cluster.description}
              tags={cluster.tags}
              onClick={() => handleClusterClick(cluster.id)}
              onFavorite={() => handleClusterFavorite(cluster.id)}
            />
          ))}
        </CardGrid>

        {clusters.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>
              No clusters yet. Add some notes to see them grouped automatically.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
