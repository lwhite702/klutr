"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export type StackCardProps = {
  title: string
  summary?: string
  count: number
  pinned?: boolean
}

export function StackCard({ title, summary, count, pinned }: StackCardProps) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{title}</CardTitle>
            <div className="flex items-center gap-2">
              {typeof pinned !== "undefined" && pinned && <Badge variant="secondary">Pinned</Badge>}
              <Badge variant="secondary">{count} notes</Badge>
            </div>
          </div>
        </CardHeader>
        {summary && (
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
          </CardContent>
        )}
      </Card>
    </motion.div>
  )
}
