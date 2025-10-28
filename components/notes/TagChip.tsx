import { Badge } from "@/components/ui/badge"

interface TagChipProps {
  tag: string
  className?: string
}

export function TagChip({ tag, className }: TagChipProps) {
  return (
    <Badge variant="outline" className={`text-xs ${className}`}>
      {tag}
    </Badge>
  )
}