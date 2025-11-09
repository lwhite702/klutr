"use client";

import React from "react";
import { cn } from "@klutr/utils";
import { ViewType } from "./ViewToggle";

interface CardGridProps {
  children: React.ReactNode;
  className?: string;
  view?: ViewType;
}

export function CardGrid({ children, className, view = "grid" }: CardGridProps) {
  // Pinboard view is handled by PinBoardView component, not CardGrid
  // Treat it as grid for type safety
  const effectiveView = view === "pinboard" ? "grid" : view;

  if (effectiveView === "list") {
    return (
      <div
        className={cn(
          "flex flex-col gap-4",
          className
        )}
      >
        {children}
      </div>
    );
  }

  if (effectiveView === "collage") {
    return (
      <div
        className={cn(
          "columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4",
          className
        )}
      >
        {children}
      </div>
    );
  }

  // Default grid view
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
}
