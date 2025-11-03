"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { Button } from "@/components/ui/button";
import { mockClusters } from "@/lib/mockData";
import { SectionSummary } from "@/components/onboarding/SectionSummary";
import { SectionTourDialog } from "@/components/onboarding/SectionTourDialog";
import { useSectionTour, type TourStep } from "@/lib/hooks/useSectionExperience";

const MINDSTORM_TOUR_STEPS: TourStep[] = [
  {
    id: "spark",
    title: "Spin up a storm",
    description: "Kick off a session and drop prompts - we cluster related threads to fuel ideation.",
  },
  {
    id: "remix",
    title: "Remix with re-cluster",
    description: "Hit Re-cluster when you want the AI to reshuffle connections and surface fresh angles.",
  },
  {
    id: "revisit",
    title: "Revisit past brilliance",
    description: "Every storm stays archived here. Dive back in to extend ideas or move their notes into stacks.",
  },
];

export default function MindStormPage() {
  const [clusters, setClusters] = useState(mockClusters);
  const mindstormTour = useSectionTour("mindstorm", MINDSTORM_TOUR_STEPS);

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
      variant="outline"
      size="sm"
      onClick={handleRecluster}
      aria-label="Re-cluster notes now"
    >
      Re-cluster now
    </Button>
  );

  return (
    <AppShell activeRoute="/app/mindstorm" showDemoBadge={true}>
      <>
        <div className="mx-auto flex max-w-5xl flex-col space-y-6">
          <SectionSummary
            sectionId="summary.mindstorm"
            title="MindStorm crash course"
            description="This is your riff room. Seed a prompt, let Klutr cluster related notes, and re-spin when you need a new angle."
            highlights={[
              "Start a storm to bundle notes and ideas around a theme instantly.",
              "Use Re-cluster to get fresh groupings when inspiration dips.",
              "Archive-worthy ideas can be saved to stacks or moved to Vault later.",
            ]}
            onStartTour={() => mindstormTour.startTour({ restart: true })}
            tourCompleted={mindstormTour.completed}
            accent="coral"
          />

          <PageHeader
            title="MindStorm"
            description="Your thoughts grouped by theme."
            actions={<ReclusterButton />}
          />

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
            <div className="py-12 text-center text-muted-foreground">
              <p>
                No clusters yet. Add some notes to see them grouped automatically.
              </p>
            </div>
          )}
        </div>

        <SectionTourDialog title="MindStorm walkthrough" accent="coral" tour={mindstormTour} />
      </>
    </AppShell>
  );
}
