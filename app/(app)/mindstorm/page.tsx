"use client";

import { useState, useRef } from "react";
import type React from "react";
import posthog from 'posthog-js';
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { ViewToggle, ViewType } from "@/components/ui/ViewToggle";
import { PinBoardView } from "@/components/ui/PinBoardView";
import { SearchBar } from "@/components/ui/SearchBar";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { TourCallout } from "@/components/tour/TourCallout";
import { SectionTourDialog } from "@/components/onboarding/SectionTourDialog";
import { useSectionOnboarding } from "@/lib/hooks/useSectionOnboarding";
import { useSectionTour } from "@/lib/hooks/useSectionExperience";
import { getOnboardingSteps, getDialogTourSteps } from "@/lib/onboardingSteps";
import { Button } from "@/components/ui/button";
import { mockClusters } from "@/lib/mockData";

export default function MindStormPage() {
  const [clusters, setClusters] = useState(mockClusters);
  const [view, setView] = useState<ViewType>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const clustersRef = useRef<HTMLDivElement>(null);
  const reclusterButtonRef = useRef<HTMLButtonElement>(null);

  // Dialog tour for first-time onboarding (auto-starts)
  const dialogTour = useSectionTour("mindstorm", getDialogTourSteps("mindstorm"), {
    autoStart: true,
  });

  // Callout tour for contextual hints (manual trigger)
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
    autoTrigger: false,
  });

  const handleRecluster = () => {
    posthog.capture('mindstorm-recluster-clicked');
    console.log("TODO: Recluster notes");
  };

  const handleClusterClick = (clusterId: string) => {
    console.log("TODO: Open cluster", clusterId);
  };

  const handleClusterFavorite = (clusterId: string) => {
    console.log("TODO: Toggle favorite for cluster", clusterId);
    setClusters(
      clusters.map((cluster) =>
        cluster.id === clusterId
          ? { ...cluster, pinned: !(cluster.pinned ?? false) }
          : cluster
      )
    );
  };

  const handleViewChange = (newView: ViewType) => {
    posthog.capture('mindstorm-view-changed', { view: newView });
    setView(newView);
  };

  // Generate relationships for pin board view
  const relationships = clusters.map((cluster, index) => {
    const nextIndex = (index + 1) % clusters.length;
    return {
      from: cluster.id,
      to: clusters[nextIndex].id,
      strength: 0.6,
    };
  });

  // Filter clusters by search
  const filteredClusters = searchQuery
    ? clusters.filter(
        (cluster) =>
          cluster.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cluster.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cluster.tags?.some((tag) => tag.label.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : clusters;

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
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="MindStorm"
        description="Your thoughts grouped by theme."
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
            <ReclusterButton />
          </>
        }
      />

      <SectionTourDialog
        title="Welcome to MindStorm"
        subtitle="AI groups your notes by theme automatically"
        accent="indigo"
        tour={dialogTour}
      />

      <SectionSummary
        section="mindstorm"
        summary="AI groups your notes by theme automatically. Related ideas cluster together as you add more notes."
      />

      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 w-full">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search clusters..."
          />
        </div>
        <ViewToggle
          view={view}
          onViewChange={handleViewChange}
          availableViews={["grid", "list", "collage", "pinboard"]}
        />
      </div>

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

      {view === "pinboard" ? (
        <PinBoardView
          items={filteredClusters}
          relationships={relationships}
          onItemClick={handleClusterClick}
          onItemFavorite={handleClusterFavorite}
        />
      ) : (
        <CardGrid view={view}>
          {filteredClusters.map((cluster) => (
            <ItemCard
              key={cluster.id}
              title={cluster.title}
              description={cluster.description}
              tags={cluster.tags}
              pinned={cluster.pinned}
              onClick={() => handleClusterClick(cluster.id)}
              onFavorite={() => handleClusterFavorite(cluster.id)}
              variant={view}
            />
          ))}
        </CardGrid>
      )}

      {filteredClusters.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>
            {searchQuery
              ? "No clusters match your search. Try a different query."
              : "No clusters yet. Add some notes to see them grouped automatically."}
          </p>
        </div>
      )}
    </div>
  );
}
