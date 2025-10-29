"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { QuickCaptureBar } from "@/components/notes/QuickCaptureBar";
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

  return (
    <AppShell activeRoute="/app">
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader title="All Notes" />

        <QuickCaptureBar onCreate={handleCreateNote} isCreating={isCreating} />

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

        {notes.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No notes yet. Add your first note above to get started.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
