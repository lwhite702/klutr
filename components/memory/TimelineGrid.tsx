"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface WeekData {
  weekLabel: string
  count: number
  topics: string[]
}

interface TimelineGridProps {
  weeks: WeekData[]
}

export function TimelineGrid({ weeks }: TimelineGridProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Memory Timeline</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {weeks.map((week, index) => (
          <motion.div
            key={week.weekLabel}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">
                    {week.weekLabel}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {week.count} {week.count === 1 ? 'note' : 'notes'}
                  </Badge>
                </div>
                
                {week.topics.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Key topics:</p>
                    <div className="flex flex-wrap gap-1">
                      {week.topics.map((topic, topicIndex) => (
                        <Badge key={topicIndex} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}