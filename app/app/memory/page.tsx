"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { TimelineGrid } from "@/components/memory/TimelineGrid";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { SectionTour } from "@/components/tour/SectionTour";
import { mockMemory } from "@/lib/mockData";

export default function MemoryLanePage() {
  const [memoryItems, setMemoryItems] = useState(mockMemory);

  const handleRevisitWeek = (week: string) => {
    console.log("TODO: Open week detail", week);
  };

  const handleMemoryClick = (memoryId: string) => {
    console.log("TODO: Open memory item", memoryId);
  };

  const handleMemoryFavorite = (memoryId: string) => {
    console.log("TODO: Toggle favorite for memory", memoryId);
  };

  const tourSteps = [
    {
      id: "memory-digest",
      targetId: "memory-content",
      title: "How It Works",
      description: "Memory Lane resurface older notes based on relevance to your current activity. It's like your notes remembering themselves.",
      position: "bottom" as const,
    },
    {
      id: "memory-timeline",
      targetId: "memory-content",
      title: "Digest View",
      description: "Notes appear in a timeline format, organized by when they were created. Click on any period to revisit those notes.",
      position: "bottom" as const,
    },
    {
      id: "memory-actions",
      targetId: "memory-content",
      title: "Take Action",
      description: "When a note resurfaces, you can revisit it, edit it, or share it. Or simply acknowledge it and let it fade back into your archive.",
      position: "bottom" as const,
    },
  ];

  return (
    <AppShell activeRoute="/app/memory">
      <SectionTour section="memory" steps={tourSteps} autoStart={true} />
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader
          title="Memory Lane"
          description="What you were thinking across time."
        />

        <SectionSummary
          title="Resurfacing Digest"
          description="Memory Lane resurface older notes based on relevance to your current activity. Notes appear in a timeline format, organized by when they were created. When a note resurfaces, you can revisit it, edit it, or share it?or simply acknowledge it and let it fade back into your archive."
          storageKey="memory"
        />

        <div id="memory-content">
          {/* Use existing TimelineGrid component if available, otherwise fall back to CardGrid */}
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
    </AppShell>
  );
}
