"use client";

import { useState, useRef, useEffect } from "react";
import type React from "react";
import posthog from "posthog-js";
import { AppShell } from "@/components/layout/AppShell";
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
import { toast } from "sonner";

interface Cluster {
  id: string;
  name: string;
  noteCount: number;
  averageConfidence: number;
  sampleNotes: Array<{
    id: string;
    content: string;
    type: string;
    confidence: number | null;
  }>;
}

export default function MindStormPage() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [view, setView] = useState<ViewType>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const clustersRef = useRef<HTMLDivElement>(null);
  const reclusterButtonRef = useRef<HTMLButtonElement>(null);

  // Dialog tour for first-time onboarding (auto-starts)
  const dialogTour = useSectionTour(
    "mindstorm",
    getDialogTourSteps("mindstorm"),
    {
      autoStart: true,
    }
  );

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

  // Load clusters from API
  useEffect(() => {
    loadClusters();
  }, []);

  async function loadClusters() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/notes/clusters");
      if (!response.ok) throw new Error("Failed to load clusters");

      const data = await response.json();
      setClusters(data.clusters || []);
    } catch (error) {
      console.error("[MindStorm] Error loading clusters:", error);
      toast.error("Failed to load clusters");
    } finally {
      setIsLoading(false);
    }
  }

  const handleRecluster = async () => {
    posthog.capture("mindstorm-recluster-clicked");

    try {
      setIsRefreshing(true);
      const response = await fetch("/api/notes/clusters/refresh", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to trigger reclustering");

      toast.success("Clustering started. This may take a few minutes.");

      // Reload clusters after a delay
      setTimeout(() => {
        loadClusters();
      }, 5000);
    } catch (error) {
      console.error("[MindStorm] Recluster error:", error);
      toast.error("Failed to recluster notes");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleClusterClick = (clusterId: string) => {
    // Navigate to cluster view
    const cluster = clusters.find((c) => c.id === clusterId);
    if (cluster) {
      window.location.href = `/stacks/${encodeURIComponent(cluster.name)}`;
    }
  };

  const handleClusterFavorite = (clusterId: string) => {
    // For now, just toggle in local state
    // TODO: Implement API endpoint for pinning clusters
    toast.info("Cluster pinning coming soon");
  };

  const handleViewChange = (newView: ViewType) => {
    posthog.capture("mindstorm-view-changed", { view: newView });
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
    ? clusters.filter((cluster) =>
        cluster.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : clusters;

  // Convert clusters to display format
  const displayClusters = filteredClusters.map((cluster) => ({
    id: cluster.id,
    title: cluster.name,
    description: `${cluster.noteCount} notes (${Math.round(
      cluster.averageConfidence * 100
    )}% confidence)`,
    tags: [{ label: `${cluster.noteCount} notes` }],
    pinned: false,
  }));

  const ReclusterButton = () => (
    <Button
      ref={reclusterButtonRef}
      variant="outline"
      size="sm"
      onClick={handleRecluster}
      disabled={isRefreshing}
      aria-label="Re-cluster notes now"
      data-onboarding="recluster-button"
      className="relative"
    >
      {isRefreshing ? "Clustering..." : "Re-cluster now"}
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
    <AppShell activeRoute="/app/mindstorm">
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

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Loading clusters...</p>
          </div>
        ) : view === "pinboard" ? (
          <PinBoardView
            items={displayClusters}
            relationships={relationships}
            onItemClick={handleClusterClick}
            onItemFavorite={handleClusterFavorite}
          />
        ) : (
          <CardGrid view={view}>
            {displayClusters.map((cluster) => (
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

        {!isLoading && displayClusters.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>
              {searchQuery
                ? "No clusters match your search. Try a different query."
                : "No clusters yet. Add some notes to see them grouped automatically."}
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
