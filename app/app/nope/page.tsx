"use client"

import { AppShell } from "@/components/layout/AppShell"
import { NoteCard } from "@/components/notes/NoteCard"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

// Mock data for discarded notes
const mockDiscardedNotes = [
  {
    content: "This was a random thought that didn't really go anywhere - just testing the app",
    tags: ["test", "random"],
    cluster: "Discarded",
    createdAt: "2024-01-10T15:30:00Z",
    archived: true
  },
  {
    content: "Old password that I changed - no longer relevant",
    tags: ["password", "security"],
    cluster: "Discarded",
    createdAt: "2024-01-08T09:15:00Z",
    archived: true
  },
  {
    content: "Meeting that got cancelled - keeping for reference but not important",
    tags: ["meeting", "cancelled"],
    cluster: "Discarded",
    createdAt: "2024-01-05T14:20:00Z",
    archived: true
  },
  {
    content: "Temporary note about grocery list - already went shopping",
    tags: ["grocery", "temporary"],
    cluster: "Discarded",
    createdAt: "2024-01-03T11:45:00Z",
    archived: true
  },
  {
    content: "Duplicate of another note - this one was less detailed",
    tags: ["duplicate"],
    cluster: "Discarded",
    createdAt: "2024-01-01T16:30:00Z",
    archived: true
  }
]

export default function NopePage() {
  const handleRestore = (index: number) => {
    console.log(`Restore note at index ${index}`)
  }

  return (
    <AppShell activeRoute="/app/nope">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Nope Bin</h1>
          <p className="text-muted-foreground">Notes you've discarded or archived</p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Discarded Notes</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockDiscardedNotes.map((note, index) => (
              <div key={index} className="space-y-3">
                <NoteCard
                  content={note.content}
                  tags={note.tags}
                  cluster={note.cluster}
                  createdAt={note.createdAt}
                  archived={note.archived}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRestore(index)}
                  className="w-full"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restore
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}