"use client";

import React from "react";
import { LayoutGrid, List, Image, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@klutr/utils";

export type ViewType = "grid" | "list" | "collage" | "pinboard";

interface ViewToggleProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  availableViews?: ViewType[];
  className?: string;
}

export function ViewToggle({
  view,
  onViewChange,
  availableViews = ["grid", "list", "collage", "pinboard"],
  className,
}: ViewToggleProps) {
  const views: { type: ViewType; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
    { type: "grid", icon: LayoutGrid, label: "Grid view" },
    { type: "list", icon: List, label: "List view" },
    { type: "collage", icon: Image, label: "Collage view" },
    { type: "pinboard", icon: Network, label: "Pin board view" },
  ];

  const filteredViews = views.filter((v) => availableViews.includes(v.type));

  return (
    <div className={cn("flex items-center gap-1 border rounded-lg p-1 bg-background", className)}>
      <TooltipProvider>
        {filteredViews.map(({ type, icon: Icon, label }) => (
          <Tooltip key={type}>
            <TooltipTrigger asChild>
              <Button
                variant={view === type ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange(type)}
                className={cn(
                  "h-8 w-8 p-0",
                  view === type &&
                    "bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white"
                )}
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}

