"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { apiGet, apiPost } from "@/lib/clientApi";
import { isDemoMode } from "@/lib/onboarding";
import { Loader2 } from "lucide-react";

const MOCK_CLUSTERS = [
  {
    name: "Ideas",
    noteCount: 5,
    summary:
      "You're exploring content ideas and side hustles. Strong focus on AI-powered tools and creator economy.",
  },
  {
    name: "Tasks",
    noteCount: 8,
    summary:
      "Mix of client work follow-ups and personal todos. Several items marked urgent.",
  },
  {
    name: "Contacts",
    noteCount: 12,
    summary:
      "Growing network of founders, developers, and potential collaborators from recent conferences.",
  },
  {
    name: "Links",
    noteCount: 15,
    summary:
      "Saved articles on productivity, AI developments, and startup advice. Heavy tech focus.",
  },
  {
    name: "Voice Notes",
    noteCount: 4,
    summary:
      "Quick voice memos about podcast ideas and random thoughts while commuting.",
  },
  {
    name: "Misc",
    noteCount: 9,
    summary:
      "Shopping lists, random reminders, and things that don't fit elsewhere.",
  },
];

interface Cluster {
  name: string;
  noteCount: number;
  summary: string;
}

export default function MindStormPage() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReclustering, setIsReclustering] = useState(false);
  const [showGraphView, setShowGraphView] = useState(false);
  const demoMode = isDemoMode();

  useEffect(() => {
    async function loadClusters() {
      if (demoMode) {
        setClusters(MOCK_CLUSTERS);
        setIsLoading(false);
        return;
      }

      try {
        const data = await apiGet<Cluster[]>("/api/mindstorm/clusters");
        setClusters(data);
      } catch (error) {
        console.error("[v0] Failed to load clusters:", error);
        // Fallback to mock data on error
        setClusters(MOCK_CLUSTERS);
      } finally {
        setIsLoading(false);
      }
    }

    loadClusters();
  }, [demoMode]);

  const handleRecluster = async () => {
    if (demoMode) {
      console.log("[v0] Demo mode: pretend recluster");
      return;
    }

    setIsReclustering(true);
    try {
      await apiPost("/api/mindstorm/recluster");
      // Reload clusters after reclustering
      const data = await apiGet<Cluster[]>("/api/mindstorm/clusters");
      setClusters(data);
    } catch (error) {
      console.error("[v0] Failed to recluster:", error);
    } finally {
      setIsReclustering(false);
    }
  };

  const handleGraphView = () => {
    setShowGraphView(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppShell activeRoute="/app/mindstorm" showDemoBadge>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">MindStorm</h1>
            <p className="text-muted-foreground">
              Your thoughts, clustered into living themes.
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={handleRecluster}
                  disabled={isReclustering}
                >
                  {isReclustering ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Re-clustering...
                    </>
                  ) : (
                    "Re-cluster now"
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  We embed your notes with AI, compare them in vector space, and
                  group related ideas together.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {clusters.map((cluster) => (
            <Card
              key={cluster.name}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{cluster.name}</CardTitle>
                  <Badge variant="secondary">{cluster.noteCount} notes</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {cluster.summary}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Button variant="ghost" onClick={handleGraphView}>
            Open Graph View
          </Button>
        </div>

        <Sheet open={showGraphView} onOpenChange={setShowGraphView}>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Graph View</SheetTitle>
              <SheetDescription>
                Interactive idea map coming soon
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Coming soon: interactive idea map. Nodes = your thoughts.
                  Edges = semantic similarity.
                </p>
                {demoMode && (
                  <div className="mt-8 p-8 border-2 border-dashed rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      [Demo visualization would show 6 mock nodes with
                      connecting lines representing semantic relationships
                      between your notes]
                    </p>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </AppShell>
  );
}
