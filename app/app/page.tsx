"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { QuickCaptureBar } from "@/components/notes/QuickCaptureBar";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { SectionTour } from "@/components/tour/SectionTour";
import { mockNotes } from "@/lib/mockData";

export default function AllNotesPage() {
  const [notes, setNotes] = useState(mockNotes);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateNote = async (content: string) => {
    setIsCreating(true);
    console.log("TODO: Create note with content:", content);

    // For now, just add a mock note locally
    const newNote = {
      id: Date.now().toString(),
      title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
      description: content,
      tags: [{ label: "unclassified" }],
      pinned: false,
    };

    setNotes([newNote, ...notes]);
    setIsCreating(false);
  };

  const handleNoteClick = (noteId: string) => {
    console.log("TODO: Open note", noteId);
  };

  const handleNoteFavorite = (noteId: string) => {
    console.log("TODO: Toggle favorite for note", noteId);
    setNotes(
      notes.map((note) =>
        note.id === noteId ? { ...note, pinned: !note.pinned } : note
      )
    );
  };

  const tourSteps = [
    {
      id: "capture-bar",
      targetId: "quick-capture-bar",
      title: "Quick Capture",
      description: "This is your inbox. Dump anything here?notes, links, half-formed ideas. Just type and save (Cmd/Ctrl + Enter for quick saves).",
      position: "bottom" as const,
    },
    {
      id: "ai-tagging",
      targetId: "quick-capture-bar",
      title: "AI Tagging",
      description: "When you save a note, AI automatically analyzes it and adds tags. These tags help organize your notes into stacks.",
      position: "bottom" as const,
    },
    {
      id: "nope-action",
      targetId: "notes-grid",
      title: "Nope It",
      description: "Swipe left on any note (or use the menu) to send it to the Nope Bin. Your choices help train Klutr to recognize what you don't want to keep.",
      position: "bottom" as const,
    },
  ];

  return (
    <AppShell activeRoute="/app">
      <SectionTour section="notes" steps={tourSteps} autoStart={true} />
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader title="All Notes" />
        
        <SectionSummary
          title="Your Inbox"
          description="This is where you dump notes and files. Just type, paste, or upload anything. AI automatically tags and organizes them into stacks. Swipe left on any note to 'Nope' it?send it to the Nope Bin if you don't need it."
          storageKey="notes"
        />

        <div id="quick-capture-bar">
          <QuickCaptureBar onCreate={handleCreateNote} isCreating={isCreating} />
        </div>

        <div id="notes-grid">
          <CardGrid>
            {notes.map((note) => (
              <ItemCard
                key={note.id}
                title={note.title}
                description={note.description}
                tags={note.tags}
                pinned={note.pinned}
                onClick={() => handleNoteClick(note.id)}
                onFavorite={() => handleNoteFavorite(note.id)}
              />
            ))}
          </CardGrid>
        </div>

        {notes.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No notes yet. Add your first note above to get started.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
