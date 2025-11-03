"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { mockStacks } from "@/lib/mockData";
import { SectionSummary } from "@/components/onboarding/SectionSummary";
import { useSectionTour, type TourStep } from "@/lib/hooks/useSectionExperience";
import { SectionTourDialog } from "@/components/onboarding/SectionTourDialog";

const STACKS_TOUR_STEPS: TourStep[] = [
  {
    id: "auto",
    title: "Auto-curated collections",
    description: "Stacks collect notes that share tags, tone, or topics - the AI keeps them fresh without you lifting a finger.",
  },
  {
    id: "browse",
    title: "Browse and pin",
    description: "Open a stack to scan the highlights and pin the ones you want quick access to in the sidebar.",
  },
  {
    id: "filter",
    title: "Filter the view",
    description: "Use filters to zero in on voice notes, links, or a tag to focus your next move.",
  },
];

export default function SmartStacksPage() {
  const [stacks, setStacks] = useState(mockStacks);
  const stacksTour = useSectionTour("stacks", STACKS_TOUR_STEPS);

  const handleStackClick = (stackName: string) => {
    console.log("TODO: Navigate to stack detail", stackName);
    // For now, navigate to a mock stack detail page
    window.location.href = `/app/stacks/${stackName
      .toLowerCase()
      .replace(/\s+/g, "-")}`;
  };

  const handleStackFavorite = (stackId: string) => {
    console.log("TODO: Toggle favorite for stack", stackId);
    setStacks(
      stacks.map((stack) =>
        stack.id === stackId ? { ...stack, pinned: !stack.pinned } : stack
      )
    );
  };

  return (
    <AppShell activeRoute="/app/stacks">
      <>
        <div className="mx-auto flex max-w-5xl flex-col space-y-6">
          <SectionSummary
            sectionId="summary.stacks"
            title="Stacks in a nutshell"
            description="Stacks are living collections - the AI keeps dropping in notes that share a vibe, tag, or topic."
            highlights={[
              "Auto-curated clusters update after every note save.",
              "Pin your go-to stacks to keep them at the top of the list.",
              "Filters slice stacks by tag, type, or recency for fast focus.",
            ]}
            onStartTour={() => stacksTour.startTour({ restart: true })}
            tourCompleted={stacksTour.completed}
            accent="indigo"
          />

          <PageHeader title="Stacks" description="Your saved collections." />

          <CardGrid>
            {stacks.map((stack) => (
              <ItemCard
                key={stack.id}
                title={stack.name}
                description={stack.description}
                tags={stack.tags}
                pinned={stack.pinned}
                onClick={() => handleStackClick(stack.name)}
                onFavorite={() => handleStackFavorite(stack.id)}
              />
            ))}
          </CardGrid>

          {stacks.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              <p>
                No stacks yet. Create some notes and run "Re-cluster now" to
                generate stacks.
              </p>
            </div>
          )}
        </div>

        <SectionTourDialog title="Stacks walkthrough" accent="indigo" tour={stacksTour} />
      </>
    </AppShell>
  );
}
