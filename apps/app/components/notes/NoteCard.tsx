import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { NoteDTO } from "@/types/note"
import { ClusterChip } from "./ClusterChip"
import { TagChip } from "./TagChip"
import { Loader2 } from "lucide-react"

interface NoteCardProps {
  note: NoteDTO
  isPending?: boolean
}

const typeColors: Record<string, string> = {
  idea: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  task: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  contact: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  link: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  voice: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  misc: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  nope: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  unclassified: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
}

export function NoteCard({ note, isPending }: NoteCardProps) {
  const formattedDate = new Date(note.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        {/* Content */}
        <p className="text-sm line-clamp-5">{note.content}</p>

        {/* Badges Row */}
        <div className="flex flex-wrap gap-2">
          <Badge className={typeColors[note.type] || typeColors.misc}>{note.type}</Badge>
          {isPending && (
            <Badge variant="secondary" className="animate-pulse">
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              thinking...
            </Badge>
          )}
          <ClusterChip cluster={note.cluster} confidence={note.clusterConfidence} />
          {note.tags.map((tag) => (
            <TagChip key={tag} label={tag} />
          ))}
        </div>

        {/* Footer Row */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formattedDate}</span>
          {note.archived && <Badge variant="destructive">archived</Badge>}
        </div>
      </CardContent>
    </Card>
  )
}
