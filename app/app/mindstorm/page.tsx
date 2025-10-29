"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { Button } from "@/components/ui/button";
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
    >
      Re-cluster now
    </Button>
  );

  return (
    <AppShell activeRoute="/app/mindstorm" showDemoBadge={true}>
      <div className="max-w-5xl mx-auto space-y-6">
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
