"use client";

import { motion } from "framer-motion";
import { TrendingUp, Lightbulb, Network } from "lucide-react";
import { brandColors } from "@klutr/brand";
import type { MuseInsight } from "@/lib/mockData";

interface InsightCardProps {
  insight: MuseInsight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const getIcon = () => {
    switch (insight.type) {
      case "top-tags":
        return <TrendingUp className="h-5 w-5" />;
      case "recurring-topics":
        return <Network className="h-5 w-5" />;
      case "idea-patterns":
        return <Lightbulb className="h-5 w-5" />;
      default:
        return <Lightbulb className="h-5 w-5" />;
    }
  };

  const renderContent = () => {
    switch (insight.type) {
      case "top-tags":
        const tags = insight.data.tags as Array<{ label: string; count: number }>;
        return (
          <div className="space-y-2">
            {tags.map((tag, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{tag.label}</span>
                <span className="text-xs text-muted-foreground">{tag.count}</span>
              </div>
            ))}
          </div>
        );
      case "recurring-topics":
        const topics = insight.data.topics as string[];
        return (
          <ul className="space-y-2">
            {topics.map((topic, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>{topic}</span>
              </li>
            ))}
          </ul>
        );
      case "idea-patterns":
        const patterns = insight.data.patterns as string[];
        return (
          <ul className="space-y-2">
            {patterns.map((pattern, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>{pattern}</span>
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-lg border bg-card"
    >
      <div className="flex items-start gap-3 mb-4">
        <div
          className="p-2 rounded-lg"
          style={{
            backgroundColor: `${brandColors.mint}20`,
            color: brandColors.mint,
          }}
        >
          {getIcon()}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{insight.title}</h3>
          <p className="text-sm text-muted-foreground">{insight.description}</p>
        </div>
      </div>
      <div className="mt-4">{renderContent()}</div>
    </motion.div>
  );
}

