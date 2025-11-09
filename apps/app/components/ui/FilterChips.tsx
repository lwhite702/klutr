"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@klutr/utils";

interface Filter {
  label: string;
  value: string;
  color?: string;
}

interface FilterChipsProps {
  filters: Filter[];
  onRemove: (value: string) => void;
  onClearAll?: () => void;
  className?: string;
}

export function FilterChips({
  filters,
  onRemove,
  onClearAll,
  className,
}: FilterChipsProps) {
  if (filters.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {filters.map((filter) => (
        <div
          key={filter.value}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm",
            "bg-[var(--klutr-coral)]/10 text-[var(--klutr-coral)]",
            "dark:bg-[var(--klutr-coral)]/20 dark:text-[var(--klutr-coral)]",
            "border border-[var(--klutr-coral)]/20"
          )}
        >
          <span>{filter.label}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-[var(--klutr-coral)]/20"
            onClick={() => onRemove(filter.value)}
            aria-label={`Remove ${filter.label} filter`}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
      {onClearAll && filters.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Clear all
        </Button>
      )}
    </div>
  );
}

