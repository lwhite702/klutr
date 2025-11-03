"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { Button } from "@/components/ui/button";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { PageTour } from "@/components/tour/PageTour";
import { HelpCenter } from "@/components/help/HelpCenter";
import { mockClusters } from "@/lib/mockData";

const tourSteps = [
  {
    id: "welcome",
    title: "Welcome to MindStorm!",
    description: "This is your AI-powered brainstorming space. We automatically group related notes by theme so you can see patterns in your thinking.",
  },
  {
    id: "clusters",
    title: "Thought Clusters",
    description: "Each cluster is a collection of related ideas. Click any cluster to explore the notes inside and see how your thoughts connect.",
  },
  {
    id: "recluster",
    title: "Re-cluster Anytime",
    description: "Hit 'Re-cluster now' when you've added lots of new notes. We'll re-analyze everything and find fresh connections you might have missed.",
  },
];

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

        <SectionSummary
          pageId="mindstorm"
          title="AI-Powered Brainstorming"
          description="MindStorm finds hidden connections in your notes and groups them by theme. It's like having a research assistant who remembers everything."
          tips={[
            "Clusters update automatically as you add notes",
            "Click any cluster to explore related ideas",
            "Use 'Re-cluster now' to refresh after bulk imports",
          ]}
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

      <PageTour pageId="mindstorm" steps={tourSteps} />
      <HelpCenter />
    </AppShell>
  );
}
