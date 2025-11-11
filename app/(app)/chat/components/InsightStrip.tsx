"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";

interface InsightStripProps {
  threadId: string | null;
}

export function InsightStrip({ threadId }: InsightStripProps) {
  if (!threadId) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-[#00C896]" />
          <h3 className="font-semibold text-sm">AI Insights</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Select a thread to see AI-generated insights and suggestions
        </p>
      </div>
    );
  }

  // TODO: Fetch insights for thread
  const insights = [
    "This thread contains 3 related ideas",
    "Consider creating a board for these topics",
    "Similar threads: Project Planning, Meeting Notes",
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-[#A7F1D1]" />
        <h3 className="font-semibold text-sm">AI Insights</h3>
      </div>
      
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <Card key={index} className="p-3 bg-muted/50">
            <p className="text-sm">{insight}</p>
          </Card>
        ))}
      </div>

      <div className="pt-4 border-t">
        <h4 className="text-xs font-semibold mb-2 text-muted-foreground">
          Quick Actions
        </h4>
        <div className="space-y-2">
          <button className="w-full text-left text-xs text-[#FF6B6B] hover:underline">
            Generate summary
          </button>
          <button className="w-full text-left text-xs text-[#FF6B6B] hover:underline">
            Find related threads
          </button>
          <button className="w-full text-left text-xs text-[#FF6B6B] hover:underline">
            Export thread
          </button>
        </div>
      </div>
    </div>
  );
}

