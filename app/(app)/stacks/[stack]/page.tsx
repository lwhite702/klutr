"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { SortAndFilterStub } from "@/components/stacks/SortAndFilterStub";
import { ArrowLeft, Loader2, RefreshCw, Sparkles, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { apiGet } from "@/lib/clientApi";
import type { NoteDTO } from "@/lib/dto";

type SmartStack = {
  id: string;
  name: string;
  cluster: string;
  noteCount: number;
  summary: string;
  pinned: boolean;
};

interface StackItem {
  id: string;
  title: string;
  description: string;
  tags: Array<{ label: string }>;
  pinned?: boolean;
}

export default function StackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const stackSlug = decodeURIComponent(params.stack as string);

  const [stackItems, setStackItems] = useState<StackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stackMeta, setStackMeta] = useState<SmartStack | null>(null);
  const [search, setSearch] = useState("");

  // Load notes for this cluster
  useEffect(() => {
    loadStackData();
  }, [stackSlug]);

  async function loadStackData(isManualRefresh = false) {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const [stacksResponse, notesResponse] = await Promise.all([
        apiGet<SmartStack[]>("/api/stacks/list"),
        apiGet<NoteDTO[]>(`/api/stacks/detail?cluster=${encodeURIComponent(stackSlug)}`),
      ]);

      const items: StackItem[] = notesResponse.map((note) => ({
        id: note.id,
        title: note.content.slice(0, 64) + (note.content.length > 64 ? "..." : ""),
        description: note.content,
        tags: note.tags.map((t) => ({ label: t })),
        pinned: false,
      }));

      setStackMeta(
        stacksResponse.find(
          (stack) => stack.cluster === stackSlug || stack.name === stackSlug
        ) || null
      );
      setStackItems(items);
    } catch (error) {
      console.error("[Stack] Load notes error:", error);
      toast.error("Failed to load stack notes");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  const handleItemClick = (itemId: string) => {
    toast.info('Note details coming soon');
  };

  const handleItemFavorite = (itemId: string) => {
    toast.info('Favorites coming soon');
  };

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return stackItems;

    return stackItems.filter((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.label.toLowerCase().includes(query))
      );
    });
  }, [stackItems, search]);

  const topKeywords = useMemo(() => {
    const counts: Record<string, number> = {};
    stackItems.forEach((item) => {
      item.tags.forEach((tag) => {
        counts[tag.label] = (counts[tag.label] || 0) + 1;
      });
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, count]) => ({ label, count }));
  }, [stackItems]);

  return (
    <AppShell activeRoute="/app/stacks">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <PageHeader
              title={stackMeta?.name || stackSlug}
              description={
                stackMeta?.summary ||
                "Notes clustered together by theme. Summaries update as you add new drops."
              }
              actions={
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Filter notes"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-52"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadStackData(true)}
                    disabled={isRefreshing}
                    className="gap-2"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </Button>
                  <SortAndFilterStub />
                </div>
              }
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading stack...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Snapshot
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>{stackMeta?.summary || "We’ll summarize this stack as notes arrive."}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{stackItems.length} notes</Badge>
                    {stackMeta?.pinned && (
                      <Badge variant="outline" className="gap-1">
                        <Pin className="h-3 w-3" />Pinned
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                    Top keywords
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {topKeywords.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No tags captured yet.</p>
                  ) : (
                    topKeywords.map((keyword) => (
                      <Badge key={keyword.label} variant="outline">
                        {keyword.label} · {keyword.count}
                      </Badge>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="h-4 w-4 text-coral" />
                    Cluster
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">{stackSlug}</p>
                  <p>
                    Stack names mirror the cluster label coming from MindStorm. Add notes to keep this stack fresh.
                  </p>
                </CardContent>
              </Card>
            </div>

            <CardGrid>
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  tags={item.tags}
                  pinned={item.pinned}
                  onClick={() => handleItemClick(item.id)}
                  onFavorite={() => handleItemFavorite(item.id)}
                />
              ))}
            </CardGrid>

            {filteredItems.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No notes match this stack yet.</p>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
