"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CollageViewProps {
  children: React.ReactNode;
  className?: string;
}

export function CollageView({ children, className }: CollageViewProps) {
  return (
    <div
      className={cn(
        "columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4",
        "[&>div]:break-inside-avoid [&>div]:mb-4",
        className
      )}
    >
      {children}
    </div>
  );
}

