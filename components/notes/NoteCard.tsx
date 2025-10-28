"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { ClusterChip } from "./ClusterChip"
import { TagChip } from "./TagChip"
import { formatDistanceToNow } from "date-fns"

interface NoteCardProps {
  content: string
  tags: string[]
  cluster?: string
  createdAt?: string
  archived?: boolean
}

export function NoteCard({ 
  content, 
  tags, 
  cluster, 
  createdAt, 
  archived = false 
}: NoteCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return ""
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
      <Card className={`p-4 hover:shadow-md transition-shadow ${archived ? 'opacity-60' : ''}`}>
        <div className="space-y-3">
          <p className="text-sm text-foreground leading-relaxed">
            {content}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {cluster && <ClusterChip cluster={cluster} />}
            {tags.map((tag, index) => (
              <TagChip key={index} tag={tag} />
            ))}
          </div>
          
          {createdAt && (
            <p className="text-xs text-muted-foreground">
              {formatDate(createdAt)}
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  )
}