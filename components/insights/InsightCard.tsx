import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface InsightCardProps {
  week: string
  summary: string
  sentiment: string
}

const sentimentColors: Record<string, string> = {
  positive: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  mixed: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  determined: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  reflective: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
}

export function InsightCard({ week, summary, sentiment }: InsightCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{week}</CardTitle>
          <Badge className={sentimentColors[sentiment] || sentimentColors.mixed}>{sentiment}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
      </CardContent>
    </Card>
  )
}
