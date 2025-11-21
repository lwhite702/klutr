"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles, RefreshCw, Pin } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { StackCard } from "@/components/stacks/StackCard";
import { CardGrid } from "@/components/ui/CardGrid";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { apiGet } from "@/lib/clientApi";

type SmartStack = {
  id: string;
  name: string;
  cluster: string;
  noteCount: number;
  summary: string;
  pinned: boolean;
};

export default function StacksPage() {
  const [stacks, setStacks] = useState<SmartStack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadStacks();
  }, []);

  async function loadStacks(isManualRefresh = false) {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await apiGet<SmartStack[]>("/api/stacks/list");
      setStacks(response);
    } catch (error) {
      console.error("[Stacks] Failed to load stacks", error);
      toast.error("Could not load stacks right now");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  const filteredStacks = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = stacks.filter((stack) => {
      if (!query) return true;
      return (
        stack.name.toLowerCase().includes(query) ||
        stack.summary.toLowerCase().includes(query)
      );
    });

    return result.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.noteCount - a.noteCount;
    });
  }, [stacks, search]);

  const pinnedCount = stacks.filter((stack) => stack.pinned).length;
  const totalNotes = stacks.reduce((acc, stack) => acc + stack.noteCount, 0);

  return (
    <AppShell activeRoute="/app/stacks">
      <div className="max-w-6xl mx-auto space-y-8">
        <PageHeader
          title="Stacks"
          description="Smart groups of related notes with summaries and quick drill-downs."
          actions={
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search stacks"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-56"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadStacks(true)}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Rebuild
              </Button>
            </div>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-xl border bg-card shadow-sm">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Smart groups discovered
            </div>
            <p className="mt-2 text-2xl font-semibold">{stacks.length}</p>
          </div>
          <div className="p-4 rounded-xl border bg-card shadow-sm">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Pin className="h-4 w-4 text-emerald-500" />
              Pinned for quick access
            </div>
            <p className="mt-2 text-2xl font-semibold">{pinnedCount}</p>
          </div>
          <div className="p-4 rounded-xl border bg-card shadow-sm">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-coral" />
              Notes represented across stacks
            </div>
            <p className="mt-2 text-2xl font-semibold">{totalNotes}</p>
          </div>
        </div>

        {isLoading ? (
          <CardGrid>
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="p-4 border rounded-xl space-y-3">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-16 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </div>
            ))}
          </CardGrid>
        ) : filteredStacks.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground">
            <Sparkles className="h-8 w-8" />
            <div className="space-y-1">
              <p className="text-base font-medium">No stacks yet</p>
              <p className="text-sm">
                Capture notes in Stream and MindStorm will group them automatically.
              </p>
            </div>
            <Button size="sm" onClick={() => loadStacks(true)}>
              Rebuild stacks
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredStacks.some((stack) => stack.pinned) && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Pinned</Badge>
                  <p className="text-sm text-muted-foreground">
                    Your go-to stacks stay on top for faster navigation.
                  </p>
                </div>
                <CardGrid>
                  {filteredStacks
                    .filter((stack) => stack.pinned)
                    .map((stack) => (
                      <StackCard
                        key={stack.id}
                        name={stack.name}
                        noteCount={stack.noteCount}
                        summary={stack.summary}
                        pinned={stack.pinned}
                      />
                    ))}
                </CardGrid>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">All stacks</Badge>
                <p className="text-sm text-muted-foreground">
                  Automatically generated clusters, sorted by activity.
                </p>
              </div>
              <CardGrid>
                {filteredStacks
                  .filter((stack) => !stack.pinned)
                  .map((stack) => (
                    <StackCard
                      key={stack.id}
                      name={stack.name}
                      noteCount={stack.noteCount}
                      summary={stack.summary}
                      pinned={stack.pinned}
                    />
                  ))}
              </CardGrid>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
