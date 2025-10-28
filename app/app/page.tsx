"use client"

import { AppShell } from "@/components/layout/AppShell"
import { QuickCaptureBar } from "@/components/notes/QuickCaptureBar"
import { NoteCard } from "@/components/notes/NoteCard"

// Mock data for notes
const mockNotes = [
  {
    content: "Remember to check the new React 19 features - the new compiler looks promising for performance improvements.",
    tags: ["react", "javascript", "performance"],
    cluster: "Web Development",
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    content: "Meeting with Sarah about the Q1 project roadmap. Need to prepare slides for the presentation.",
    tags: ["work", "meeting", "presentation"],
    cluster: "Work",
    createdAt: "2024-01-14T14:20:00Z"
  },
  {
    content: "Great article about TypeScript 5.0 new features - const assertions and template literal types are game changers.",
    tags: ["typescript", "programming", "learning"],
    cluster: "Web Development",
    createdAt: "2024-01-13T09:15:00Z"
  },
  {
    content: "Coffee shop recommendation: Blue Bottle on 3rd street has amazing pour-over coffee and great wifi for remote work.",
    tags: ["coffee", "remote-work", "recommendation"],
    cluster: "Personal",
    createdAt: "2024-01-12T16:45:00Z"
  },
  {
    content: "Book idea: 'The Art of Mindful Coding' - exploring how meditation principles can improve software development practices.",
    tags: ["book-idea", "mindfulness", "coding"],
    cluster: "Creative",
    createdAt: "2024-01-11T11:30:00Z"
  }
]

export default function NotesPage() {
  const handleNoteSubmit = (text: string) => {
    console.log("New note submitted:", text)
  }

  return (
    <AppShell activeRoute="/app" showDemoBadge={true}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Notes</h1>
          <p className="text-muted-foreground">Capture your thoughts and ideas</p>
        </div>
        
        <QuickCaptureBar onSubmit={handleNoteSubmit} />
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Notes</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockNotes.map((note, index) => (
              <NoteCard
                key={index}
                content={note.content}
                tags={note.tags}
                cluster={note.cluster}
                createdAt={note.createdAt}
              />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}