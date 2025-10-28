import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export type InsightCardProps = {
  weekRange: string
  summary: string
  mood?: string
}

export function InsightCard({ weekRange, summary, mood }: InsightCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{weekRange}</CardTitle>
          {mood && <Badge variant="secondary">{mood}</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
      </CardContent>
    </Card>
  )
}
