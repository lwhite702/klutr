"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { Button } from "@/components/ui/button";
import { InsightCard } from "@/components/insights/InsightCard";
import { mockInsights } from "@/lib/mockData";

export default function InsightsPage() {
  const [insights, setInsights] = useState(mockInsights);

  const handleGenerateSummary = () => {
    console.log("TODO: Generate weekly summary");
  };

  const handleInsightClick = (insightId: string) => {
    console.log("TODO: Open insight", insightId);
  };

  const GenerateButton = () => (
    <Button
      variant="outline"
      size="sm"
      onClick={handleGenerateSummary}
      aria-label="Generate weekly summary"
    >
      Generate Summary
    </Button>
  );

  return (
    <AppShell activeRoute="/app/insights">
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader
          title="Weekly Insights"
          description="Highlights from your recent activity."
          actions={<GenerateButton />}
        />

        {/* Use existing InsightCard component if available, otherwise fall back to ItemCard */}
        <div className="space-y-4">
          {insights.map((insight) => (
            <InsightCard
              key={insight.id}
              week={insight.title}
              summary={insight.description}
              sentiment={insight.tags[0]?.label || "mixed"}
            />
          ))}
        </div>

        {insights.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>
              No insights yet. Generate your first weekly summary to get
              started.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
