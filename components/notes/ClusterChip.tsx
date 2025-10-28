import { Badge } from "@/components/ui/badge"

interface ClusterChipProps {
  cluster: string
  className?: string
}

export function ClusterChip({ cluster, className }: ClusterChipProps) {
  return (
    <Badge variant="secondary" className={`text-xs ${className}`}>
      {cluster}
    </Badge>
  )
}