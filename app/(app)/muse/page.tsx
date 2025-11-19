"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { InsightCard } from "@/components/muse/InsightCard";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { apiGet, apiPost } from "@/lib/clientApi";
import { toast } from "sonner";
import type { MuseInsight } from "@/lib/mockData";

interface GeneratedInsight {
  id: string;
  title: string;
  description: string;
  type?: string;
  generatedAt?: string;
  relevance?: string;
}

interface InsightsResponse {
  insights: GeneratedInsight[];
  statistics?: {
    noteCount: number;
    topTags: string[];
    typeDistribution: Record<string, number>;
    clusterCount: number;
  };
}

export default function MusePage() {
  const [insights, setInsights] = useState<MuseInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to get existing insights first
      try {
        const existingInsights = await apiGet<any[]>("/api/insights/list");
        if (existingInsights && existingInsights.length > 0) {
          // Transform weeklyInsight to MuseInsight format
          const transformed: MuseInsight[] = existingInsights
            .slice(0, 6)
            .map((insight, idx) => ({
              id: insight.id || `insight-${idx}`,
              type: "idea-patterns" as const,
              title: `Weekly Summary - ${new Date(
                insight.weekStart
              ).toLocaleDateString()}`,
              description: insight.summary || "Weekly insight from your notes",
              data: {
                summary: insight.summary,
                sentiment: insight.sentiment,
                noteCount: insight.noteCount,
              },
            }));
          setInsights(transformed);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        // If no existing insights, generate new ones
        console.log("[Muse] No existing insights, will generate");
      }

      // Generate new insights
      await generateInsights();
    } catch (err) {
      console.error("[Muse] Load insights error:", err);
      setError("Failed to load insights. Please try again.");
      setInsights([]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateInsights = async () => {
    try {
      setIsGenerating(true);
      const response = await apiPost<InsightsResponse>(
        "/api/insights/generate",
        {}
      );

      // Transform generated insights to MuseInsight format
      const transformed: MuseInsight[] = response.insights.map((insight) => ({
        id: insight.id,
        type: (insight.type as MuseInsight["type"]) || "idea-patterns",
        title: insight.title,
        description: insight.description,
        data: {
          ...(response.statistics?.topTags && {
            tags: response.statistics.topTags.slice(0, 5).map((tag, idx) => ({
              label: tag,
              count: idx + 1, // Placeholder count
            })),
          }),
          ...(response.statistics && {
            noteCount: response.statistics.noteCount,
            clusterCount: response.statistics.clusterCount,
          }),
        },
      }));

      setInsights(transformed);
      toast.success("Insights generated successfully");
    } catch (err) {
      console.error("[Muse] Generate insights error:", err);
      toast.error("Failed to generate insights");
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <AppShell activeRoute="/app/muse">
        <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader
          title="Muse"
          description="Weekly AI insights about your note-taking patterns and idea connections"
        />
        <div className="text-center py-16">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading insights...</p>
        </div>
      </div>
      </AppShell>
    );
  }

  return (
    <AppShell activeRoute="/app/muse">
      <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Muse"
        description="Weekly AI insights about your note-taking patterns and idea connections"
        actions={
          <Button
            onClick={generateInsights}
            disabled={isGenerating}
            variant="outline"
            className="rounded-lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Insights
              </>
            )}
          </Button>
        }
      />
      {error ? (
        <div className="text-center py-16">
          <p className="text-destructive text-lg mb-2">{error}</p>
          <Button
            onClick={loadInsights}
            variant="outline"
            className="rounded-lg"
          >
            Retry
          </Button>
        </div>
      ) : (
        <>
          <CardGrid>
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </CardGrid>
          {insights.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-2">
                No insights yet
              </p>
              <p className="text-muted-foreground text-sm mb-4">
                Generate insights to discover patterns in your notes
              </p>
              <Button
                onClick={generateInsights}
                disabled={isGenerating}
                className="rounded-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Insights"
                )}
              </Button>
            </div>
          )}
        </>
      )}
      </div>
    </AppShell>
  );
}
