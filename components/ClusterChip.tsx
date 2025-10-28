import { Badge } from "@/components/ui/badge"

type ClusterChipProps = {
  cluster?: string
}

export function ClusterChip({ cluster }: ClusterChipProps) {
  if (!cluster) return null
  return (
    <Badge variant="secondary" className="rounded-full text-xs">
      {cluster}
    </Badge>
  )
}
