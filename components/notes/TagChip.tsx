import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TagChipProps {
  label: string;
  colorClassName?: string;
  showTooltip?: boolean;
}

export function TagChip({ label, colorClassName, showTooltip = true }: TagChipProps) {
  const chip = (
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

  if (!showTooltip) {
    return chip;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {chip}
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">
            AI tagged this note as "{label}". Tags help organize notes into stacks.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
