import { Badge } from "@/components/ui/badge"

interface ClusterChipProps {
  cluster?: string | null
  confidence?: number | null
}

export function ClusterChip({ cluster, confidence }: ClusterChipProps) {
  if (!cluster || confidence === null || confidence === undefined) {
    return <Badge variant="secondary">—</Badge>
  }

  const pct = Math.round(confidence * 100)

  return (
    <Badge variant="secondary">
      {cluster} {pct}%
    </Badge>
  )
}
