"use client";

import { Badge } from "@/components/ui/badge";
import { brandColors } from "@klutr/brand";

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
          className="text-xs cursor-pointer hover:opacity-80 transition-opacity rounded-2xl bg-[var(--klutr-mint)]/20 text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] border-[var(--klutr-mint)]/40"
          onClick={() => onTagClick?.(tag.label)}
        >
          {tag.label}
        </Badge>
      ))}
    </div>
  );
}

