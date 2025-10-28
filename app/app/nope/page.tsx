"use client"

import { AppShell } from "@/components/AppShell"
import { NoteCard, type NoteCardProps } from "@/components/NoteCard"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

const MOCK_NOTES: (NoteCardProps & { id: string })[] = [
  {
    id: "1",
    content: "Maybe start a newsletter? Nah, too much work and everyone has one already.",
    archived: true,
    createdAt: "2025-10-17T15:30:00Z",
    tags: ["content"],
  },
  {
    id: "2",
    content: "Build a Chrome extension for... actually, no one uses them anymore.",
    archived: true,
    createdAt: "2025-10-15T09:20:00Z",
    tags: ["product"],
  },
]

export default function NopeBinPage() {
  return (
    <AppShell activeRoute="/app/nope" showDemoBadge>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Nope Bin</h1>
          <p className="text-muted-foreground">Stuff we've safely shelved. You can restore it later.</p>
        </div>

        <div className="grid gap-4">
          {MOCK_NOTES.map((note) => (
            <div key={note.id} className="relative">
              <div className="absolute top-4 right-4 z-10">
                <Button size="sm" variant="outline" onClick={() => console.log("Restore", note.id)}>
                  <RotateCcw className="mr-1 h-3 w-3" />
                  Restore
                </Button>
              </div>
              <NoteCard {...note} />
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
