"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { TimelineGrid } from "@/components/memory/TimelineGrid";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { PageTour } from "@/components/tour/PageTour";
import { HelpCenter } from "@/components/help/HelpCenter";
import { mockMemory } from "@/lib/mockData";

const tourSteps = [
  {
    id: "welcome",
    title: "Welcome to Memory Lane!",
    description: "Your personal timeline of thoughts and ideas. We resurface older notes at just the right time, helping you rediscover forgotten gems.",
  },
  {
    id: "timeline",
    title: "Your Thought Timeline",
    description: "Browse by week to see what you were thinking about in the past. Perfect for spotting recurring themes or revisiting old projects.",
  },
  {
    id: "resurfacing",
    title: "Smart Resurfacing",
    description: "Our AI brings back relevant notes based on what you're working on now. It's like having a memory assistant who knows when to remind you of past ideas.",
  },
];

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

        <SectionSummary
          pageId="memory"
          title="Resurfacing & Time Travel"
          description="Memory Lane brings back older notes when they're most relevant. Browse your timeline to see how your thinking has evolved over weeks and months."
          tips={[
            "Notes resurface automatically based on context",
            "Click any week to see what you captured then",
            "Great for tracking long-term projects or personal growth",
          ]}
        />

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

      <PageTour pageId="memory" steps={tourSteps} />
      <HelpCenter />
    </AppShell>
  );
}
