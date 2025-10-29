"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { StackCard } from "@/components/stacks/StackCard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { apiGet } from "@/lib/clientApi";
import { isDemoMode } from "@/lib/onboarding";
import { HelpCircle } from "lucide-react";

const MOCK_STACKS = [
  {
    name: "Podcast Ideas",
    noteCount: 7,
    summary:
      "Ideas around creator economy + AI clips. Potential guests and episode formats.",
    pinned: false,
  },
  {
    name: "2025 Goals",
    noteCount: 3,
    summary:
      "Saving money, building product, time freedom. Focus on sustainable growth.",
    pinned: true,
  },
  {
    name: "Client Work",
    noteCount: 5,
    summary:
      "Follow-ups and deliverables for freelance clients. Deadlines and project notes.",
    pinned: false,
  },
  {
    name: "Learning Resources",
    noteCount: 12,
    summary:
      "Courses, tutorials, and articles saved for later. Heavy focus on AI and web development.",
    pinned: false,
  },
  {
    name: "Side Project Ideas",
    noteCount: 9,
    summary:
      "Various SaaS and product ideas. Some validated, others just random thoughts.",
    pinned: false,
  },
  {
    name: "Personal",
    noteCount: 4,
    summary: "Health goals, relationship notes, and personal reflections.",
    pinned: false,
  },
];

interface Stack {
  name: string;
  noteCount: number;
  summary: string;
  pinned: boolean;
}

export default function SmartStacksPage() {
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const demoMode = isDemoMode();

  useEffect(() => {
    async function loadStacks() {
      if (demoMode) {
        setStacks(MOCK_STACKS);
        setIsLoading(false);
        return;
      }

      try {
        const data = await apiGet<Stack[]>("/api/stacks/list");
        setStacks(data);
      } catch (error) {
        console.error("[v0] Failed to load stacks:", error);
        // Fallback to mock data
        setStacks(MOCK_STACKS);
      } finally {
        setIsLoading(false);
      }
    }

    loadStacks();
  }, [demoMode]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppShell activeRoute="/app/stacks">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Smart Stacks
            </h1>
            <p className="text-muted-foreground">
              Curated collections of related notes.
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Stacks are like playlists. We auto-group related thoughts so
                  you don't have to organize.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {stacks.map((stack) => (
            <StackCard
              key={stack.name}
              name={stack.name}
              noteCount={stack.noteCount}
              summary={stack.summary}
              pinned={stack.pinned}
            />
          ))}
        </div>

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
