"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { brandColors } from "@klutr/brand";

interface AutoSummaryProps {
  isAnalyzing?: boolean;
  summary?: string;
}

export function AutoSummary({ isAnalyzing = false, summary }: AutoSummaryProps) {
  if (!isAnalyzing && !summary) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 rounded-lg border"
      style={{
        backgroundColor: `${brandColors.mint}15`,
        borderColor: `${brandColors.mint}30`,
      }}
    >
      {isAnalyzing ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" style={{ color: brandColors.mint }} />
          <span className="text-sm" style={{ color: brandColors.charcoal }}>
            AI is analyzing your stream...
          </span>
        </div>
      ) : (
        summary && (
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: brandColors.charcoal }}>
              Stream Summary
            </p>
            <p className="text-sm" style={{ color: brandColors.charcoal }}>
              {summary}
            </p>
          </div>
        )
      )}
    </motion.div>
  );
}

