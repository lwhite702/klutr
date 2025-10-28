"use client"

import { useState } from "react"
import { AppShell } from "@/components/AppShell"
import { QuickCaptureBar } from "@/components/QuickCaptureBar"
import { NoteCard, type NoteCardProps } from "@/components/NoteCard"

const MOCK_NOTES: NoteCardProps[] = [
  {
    content:
      "Build a SaaS that repurposes creator content across platforms. Maybe use AI to auto-generate captions?",
    tags: ["saas", "ai", "content"],
    cluster: "Ideas",
    createdAt: "2025-10-24T10:30:00Z",
  },
  {
    content: "Call Sarah about the freelance project deadline — confirm Friday.",
    tags: ["work", "urgent"],
    cluster: "Tasks",
    createdAt: "2025-10-23T14:20:00Z",
  },
  {
    content: "John Doe — john@example.com — Met at the conference, interested in AI projects",
    tags: ["networking", "ai"],
    cluster: "Contacts",
    createdAt: "2025-10-22T16:45:00Z",
  },
]

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteCardProps[]>(MOCK_NOTES)

  return (
    <AppShell activeRoute="/app" showDemoBadge>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Notes</h1>
          <p className="text-muted-foreground">Capture everything. We'll organize it.</p>
        </div>

        <QuickCaptureBar onSubmit={(text) => setNotes([{ content: text, tags: [], createdAt: new Date().toISOString() }, ...notes])} />

        <div className="grid gap-4">
          {notes.map((n, idx) => (
            <NoteCard key={idx} {...n} />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
