"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smile, Frown, Meh } from "lucide-react"

interface InsightCardProps {
  weekRange: string
  summary: string
  mood?: string
}

export function InsightCard({ weekRange, summary, mood }: InsightCardProps) {
  const getMoodIcon = (mood?: string) => {
    switch (mood?.toLowerCase()) {
      case 'positive':
        return <Smile className="h-4 w-4 text-green-500" />
      case 'negative':
        return <Frown className="h-4 w-4 text-red-500" />
      case 'neutral':
        return <Meh className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getMoodVariant = (mood?: string) => {
    switch (mood?.toLowerCase()) {
      case 'positive':
        return 'default'
      case 'negative':
        return 'destructive'
      case 'neutral':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">
              {weekRange}
            </h3>
            {mood && (
              <Badge variant={getMoodVariant(mood)} className="text-xs flex items-center gap-1">
                {getMoodIcon(mood)}
                {mood}
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {summary}
          </p>
        </div>
      </Card>
    </motion.div>
  )
}