"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pin } from "lucide-react"

interface StackCardProps {
  title: string
  summary?: string
  count: number
  pinned?: boolean
}

export function StackCard({ title, summary, count, pinned = false }: StackCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="group"
    >
      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-sm leading-tight">
              {title}
            </h3>
            {pinned && (
              <Pin className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          
          {summary && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {summary}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {count} {count === 1 ? 'item' : 'items'}
            </Badge>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}