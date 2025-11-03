"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { Button } from "@/components/ui/button";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { SectionTour } from "@/components/tour/SectionTour";
import { mockClusters } from "@/lib/mockData";

export default function MindStormPage() {
  const [clusters, setClusters] = useState(mockClusters);

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
      id="recluster-button"
    >
      Re-cluster now
    </Button>
  );

  const tourSteps = [
    {
      id: "recluster-button",
      targetId: "recluster-button",
      title: "Start a MindStorm",
      description: "Click 'Re-cluster now' to group your notes by theme. AI analyzes your notes and finds connections between related ideas.",
      position: "bottom" as const,
    },
    {
      id: "clusters",
      targetId: "clusters-grid",
      title: "Explore Ideas",
      description: "Click on any cluster to see related notes. Your brainstormed clusters persist, so you can revisit ideas anytime.",
      position: "bottom" as const,
    },
  ];

  return (
    <AppShell activeRoute="/app/mindstorm" showDemoBadge={true}>
      <SectionTour section="mindstorm" steps={tourSteps} autoStart={true} />
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader
          title="MindStorm"
          description="Your thoughts grouped by theme."
          actions={<ReclusterButton />}
        />

        <SectionSummary
          title="Brainstorming Space"
          description="MindStorm automatically groups your notes by theme using AI. Click 'Re-cluster now' to refresh groupings with your latest notes. Explore clusters to discover connections between your scattered thoughts."
          storageKey="mindstorm"
        />

        <div id="clusters-grid">
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
        </div>

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
