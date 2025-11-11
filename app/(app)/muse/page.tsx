"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { InsightCard } from "@/components/muse/InsightCard";
import { mockMuseInsights } from "@/lib/mockData";

export default function MusePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader
          title="Muse"
          description="Weekly AI insights about your note-taking patterns and idea connections"
        />
        <CardGrid>
          {mockMuseInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </CardGrid>
        {mockMuseInsights.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-2">
              No insights yet
            </p>
            <p className="text-muted-foreground text-sm">
              Insights are generated weekly based on your stream activity
            </p>
          </div>
        )}
    </div>
  );
}
