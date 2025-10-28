import { Card, CardContent } from "@/components/ui/card"
import { Lock } from "lucide-react"
import { format } from "date-fns"

interface VaultNote {
  id: string
  createdAt: string
}

interface VaultListProps {
  notes: VaultNote[]
}

export function VaultList({ notes }: VaultListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No vault notes yet. Create one to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <Card key={note.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Encrypted note</span>
            </div>
            <span className="text-xs text-muted-foreground">{format(new Date(note.createdAt), "MMM d, yyyy")}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
