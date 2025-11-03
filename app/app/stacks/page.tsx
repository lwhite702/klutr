"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { PageTour } from "@/components/tour/PageTour";
import { HelpCenter } from "@/components/help/HelpCenter";
import { mockStacks } from "@/lib/mockData";

const tourSteps = [
  {
    id: "welcome",
    title: "Welcome to Stacks!",
    description: "Stacks are smart collections of notes grouped by tags or topics. Think of them as auto-organized folders that never get messy.",
  },
  {
    id: "browse",
    title: "Browse Your Collections",
    description: "Each stack shows notes with similar themes. Click any stack to see all related notes. New notes are automatically added to the right stacks.",
  },
  {
    id: "favorites",
    title: "Star Your Favorites",
    description: "Working on something specific? Star a stack to keep it at the top. Perfect for active projects or research topics.",
  },
];

export default function SmartStacksPage() {
  const [stacks, setStacks] = useState(mockStacks);

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
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader title="Stacks" description="Your saved collections." />

        <SectionSummary
          pageId="stacks"
          title="Smart Collections by Tag & Topic"
          description="Stacks organize your notes into logical groups automatically. No manual filing needed?just browse and find what you need."
          tips={[
            "Stacks are created automatically from your note tags",
            "Click a stack to see all notes in that collection",
            "Star important stacks to keep them easily accessible",
          ]}
        />

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
          <div className="text-center py-12 text-muted-foreground">
            <p>
              No stacks yet. Create some notes and run "Re-cluster now" to
              generate stacks.
            </p>
          </div>
        )}
      </div>

      <PageTour pageId="stacks" steps={tourSteps} />
      <HelpCenter />
    </AppShell>
  );
}
