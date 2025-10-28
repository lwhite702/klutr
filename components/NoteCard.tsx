"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClusterChip } from "@/components/ClusterChip"
import { TagChip } from "@/components/TagChip"

export type NoteCardProps = {
  content: string
  tags: string[]
  cluster?: string
  createdAt?: string
  archived?: boolean
}

export function NoteCard({ content, tags, cluster, createdAt, archived }: NoteCardProps) {
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : undefined

  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.15 }}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 space-y-3">
          <p className="text-sm leading-relaxed">
            {content}
          </p>

          <div className="flex flex-wrap gap-2">
            {cluster && <ClusterChip cluster={cluster} />}
            {tags.map((t) => (
              <TagChip key={t} label={t} />
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {formattedDate && <span>{formattedDate}</span>}
            {archived && <Badge variant="destructive">archived</Badge>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
