"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ArrowUpDown, Filter } from "lucide-react";

export function SortAndFilterStub() {
  const handleSortChange = (sortBy: string) => {
    console.log("TODO: sort by", sortBy);
  };

  const handleFilterChange = (filterBy: string) => {
    console.log("TODO: filter by", filterBy);
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowUpDown className="h-3 w-3" />
            Sort
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleSortChange("recent")}>
            Most recent
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortChange("title")}>
            Title A-Z
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortChange("pinned")}>
            Pinned first
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-3 w-3" />
            Filter
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleFilterChange("all")}>
            All items
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange("pinned")}>
            Pinned only
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange("recent")}>
            Recent only
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
