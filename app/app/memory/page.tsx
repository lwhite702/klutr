"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { TimelineGrid } from "@/components/memory/TimelineGrid";
import { mockMemory } from "@/lib/mockData";
import { SectionSummary } from "@/components/onboarding/SectionSummary";
import { useSectionTour, type TourStep } from "@/lib/hooks/useSectionExperience";
import { SectionTourDialog } from "@/components/onboarding/SectionTourDialog";

const MEMORY_TOUR_STEPS: TourStep[] = [
  {
    id: "digest",
    title: "Digest drops",
    description: "Klutr resurfaces older notes in timely batches so you can reconnect with forgotten gems.",
  },
  {
    id: "revisit",
    title: "Jump into a week",
    description: "Tap a week tile to see what the AI picked and spin off new actions or stacks.",
  },
  {
    id: "prune",
    title: "Prune what's stale",
    description: "Dismiss items that no longer matter so your digest stays useful and focused.",
  },
];

export default function MemoryLanePage() {
  const [memoryItems, setMemoryItems] = useState(mockMemory);
  const memoryTour = useSectionTour("memory", MEMORY_TOUR_STEPS);

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
      <>
        <div className="mx-auto flex max-w-5xl flex-col space-y-6">
          <SectionSummary
            sectionId="summary.memory"
            title="Memory Lane cheat sheet"
            description="The digest replays the notes you might have forgotten right when they're useful again."
            highlights={[
              "We space out resurfacing so you're never overwhelmed.",
              "Tap a week tile to dive back into the AI-curated highlights.",
              "Dismiss what's stale so the digest adapts to what you care about now.",
            ]}
            onStartTour={() => memoryTour.startTour({ restart: true })}
            tourCompleted={memoryTour.completed}
            accent="indigo"
          />

          <PageHeader
            title="Memory Lane"
            description="What you were thinking across time."
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
            <div className="py-12 text-center text-muted-foreground">
              <p>No memories yet. Add some notes to see your timeline.</p>
            </div>
          )}
        </div>

        <SectionTourDialog title="Memory Lane walkthrough" accent="indigo" tour={memoryTour} />
      </>
    </AppShell>
  );
}
