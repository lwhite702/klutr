import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagChipProps {
  label: string;
  colorClassName?: string;
}

export function TagChip({ label, colorClassName }: TagChipProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-[var(--radius-chip)] text-xs font-medium lowercase",
        colorClassName
      )}
    >
      {label}
    </Badge>
  );
}
