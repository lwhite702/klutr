"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@klutr/utils";
import { useSectionSummary } from "@/lib/hooks/useSectionExperience";

interface SectionSummaryProps {
  section: string;
  summary: string;
  className?: string;
}

export function SectionSummary({
  section,
  summary,
  className,
}: SectionSummaryProps) {
  const { expanded, ready, toggle } = useSectionSummary(section, true);

  return (
    <div
      className={cn(
        "rounded-lg border bg-muted/30 px-4 py-3 transition-colors border-l-4 border-l-[var(--color-brand-indigo)]/30",
        className
      )}
    >
      {ready && (
        <div className="flex items-start justify-between gap-2">
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 text-sm text-muted-foreground"
              >
                {summary}
              </motion.p>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={toggle}
            aria-label={expanded ? "Collapse summary" : "Expand summary"}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
