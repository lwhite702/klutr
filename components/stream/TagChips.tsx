"use client";

import { Badge } from "@/components/ui/badge";
import { brandColors } from "@/lib/brand.config";

interface TagChipsProps {
  tags: Array<{ label: string }>;
  onTagClick?: (tag: string) => void;
  className?: string;
}

export function TagChips({ tags, onTagClick, className }: TagChipsProps) {
  if (tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className || ""}`}>
      {tags.map((tag, index) => (
        <Badge
          key={`${tag.label}-${index}`}
          variant="secondary"
          className="text-xs cursor-pointer hover:opacity-80 transition-opacity"
          style={{
            backgroundColor: `${brandColors.mint}20`,
            color: brandColors.charcoal,
            borderColor: `${brandColors.mint}40`,
          }}
          onClick={() => onTagClick?.(tag.label)}
        >
          {tag.label}
        </Badge>
      ))}
    </div>
  );
}

