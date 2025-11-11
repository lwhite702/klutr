"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TagChip } from "@/components/notes/TagChip"

interface TimelineItem {
  week: string
  count: number
  topics: string[]
}

interface TimelineGridProps {
  items: TimelineItem[]
  onRevisit: (week: string) => void
}

export function TimelineGrid({ items, onRevisit }: TimelineGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.week} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{item.week}</CardTitle>
              <Badge variant="secondary">{item.count} notes</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {item.topics.map((topic) => (
                <TagChip key={topic} label={topic} />
              ))}
            </div>
            <Button size="sm" variant="outline" className="w-full bg-transparent" onClick={() => onRevisit(item.week)}>
              Revisit
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
