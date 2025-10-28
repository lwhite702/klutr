import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TagChip } from "@/components/TagChip"

export type TimelineWeek = {
  weekLabel: string
  count: number
  topics: string[]
}

export type TimelineGridProps = {
  weeks: TimelineWeek[]
}

export function TimelineGrid({ weeks }: TimelineGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {weeks.map((item) => (
        <Card key={item.weekLabel} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{item.weekLabel}</CardTitle>
              <Badge variant="secondary">{item.count} notes</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {item.topics.map((topic) => (
                <TagChip key={topic} label={topic} />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
