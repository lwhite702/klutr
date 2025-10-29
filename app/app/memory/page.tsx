"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { TimelineGrid } from "@/components/memory/TimelineGrid";
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

  return (
    <AppShell activeRoute="/app/memory">
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader
          title="Memory Lane"
          description="What you were thinking across time."
        />

        {/* Use existing TimelineGrid component if available, otherwise fall back to CardGrid */}
        <TimelineGrid
          items={memoryItems.map((item) => ({
            week: item.period,
            count: 1,
            topics: item.tags.map((tag) => tag.label),
          }))}
          onRevisit={handleRevisitWeek}
        />

        {memoryItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No memories yet. Add some notes to see your timeline.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
