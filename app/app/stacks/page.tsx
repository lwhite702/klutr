"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { mockStacks } from "@/lib/mockData";

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
    </AppShell>
  );
}
