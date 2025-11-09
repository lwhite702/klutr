"use client";

import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@klutr/utils";

export type SortOption = "date" | "title" | "tags" | "pinned";
export type SortDirection = "asc" | "desc";

interface SortDropdownProps {
  sortBy: SortOption;
  direction: SortDirection;
  onSortChange: (sort: SortOption, direction: SortDirection) => void;
  className?: string;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "date", label: "Date" },
  { value: "title", label: "Title" },
  { value: "tags", label: "Tags" },
  { value: "pinned", label: "Pinned" },
];

export function SortDropdown({
  sortBy,
  direction,
  onSortChange,
  className,
}: SortDropdownProps) {
  const currentOption = sortOptions.find((opt) => opt.value === sortBy);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-2", className)}
        >
          <ArrowUpDown className="h-4 w-4" />
          <span className="hidden sm:inline">Sort:</span>
          <span>{currentOption?.label}</span>
          {direction === "asc" ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => {
              const newDirection =
                sortBy === option.value && direction === "asc" ? "desc" : "asc";
              onSortChange(option.value, newDirection);
            }}
            className={cn(
              sortBy === option.value && "bg-accent"
            )}
          >
            <div className="flex items-center gap-2">
              {option.label}
              {sortBy === option.value && (
                direction === "asc" ? (
                  <ArrowUp className="h-3 w-3 ml-auto" />
                ) : (
                  <ArrowDown className="h-3 w-3 ml-auto" />
                )
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

