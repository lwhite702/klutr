"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const collapseKey = `section-summary-collapsed:${section}`;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(collapseKey);
      if (stored === "1") {
        setIsCollapsed(true);
      }
    }
  }, [collapseKey]);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem(collapseKey, newState ? "1" : "0");
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg border bg-muted/30 px-4 py-3 transition-colors border-l-4 border-l-[var(--color-brand-indigo)]/30",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <AnimatePresence initial={false}>
          {!isCollapsed && (
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
          onClick={toggleCollapse}
          aria-label={isCollapsed ? "Expand summary" : "Collapse summary"}
        >
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
