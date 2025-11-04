"use client";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TagChipProps {
  label: string;
  colorClassName?: string;
}

// Color mapping for common tag types
const getTagColor = (label: string): string => {
  const normalized = label.toLowerCase();

  // BBQ/Cooking related
  if (["bbq", "cooking", "grill", "smoker"].includes(normalized)) {
    return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
  }

  // Tasks/Actions
  if (["task", "todo", "action"].includes(normalized)) {
    return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
  }

  // Ideas/Content
  if (["idea", "content", "audio", "podcast"].includes(normalized)) {
    return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800";
  }

  // Gear/Equipment
  if (["gear", "wishlist", "upgrade", "equipment"].includes(normalized)) {
    return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800";
  }

  // People/Contacts
  if (["contact", "people", "logistics"].includes(normalized)) {
    return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800";
  }

  // Work/Professional
  if (["work", "client", "professional"].includes(normalized)) {
    return "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800";
  }

  // Research/Planning
  if (["research", "planning", "timeline"].includes(normalized)) {
    return "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800";
  }

  // Default accent color
  return "bg-accent/50 text-accent-foreground border-accent";
};

export function TagChip({ label, colorClassName }: TagChipProps) {
  const colorClass = colorClassName || getTagColor(label);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              "rounded-[var(--radius-chip)] text-xs font-medium lowercase border cursor-help",
              colorClass
            )}
          >
            {label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">
            Tags help organize notes and create connections between related
            ideas. Tags are added automatically based on note content.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
