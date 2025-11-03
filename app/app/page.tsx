"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { QuickCaptureBar } from "@/components/notes/QuickCaptureBar";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { PageTour } from "@/components/tour/PageTour";
import { HelpCenter } from "@/components/help/HelpCenter";
import { mockNotes } from "@/lib/mockData";

const tourSteps = [
  {
    id: "welcome",
    title: "Welcome to your Notes inbox!",
    description: "This is where all your ideas, links, and files land. Think of it as your brain's catch-all?messy is fine, we'll organize it.",
  },
  {
    id: "capture",
    title: "Quick Capture Bar",
    description: "Type, paste links, or drop files here. Our AI will automatically tag and categorize everything. No folders, no fuss.",
  },
  {
    id: "ai-tags",
    title: "AI Does the Work",
    description: "Watch those colorful tags appear? That's our AI reading your content and sorting it into categories like 'ideas', 'tasks', or 'reminders'. You can edit them if needed.",
  },
  {
    id: "nope-swipe",
    title: "Nope the Noise",
    description: "See something you don't need? Click or swipe to 'Nope' it. Items move to your Nope Bin where you can restore them anytime within 30 days.",
  },
];

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

        <SectionSummary
          pageId="notes"
          title="Your Brain's Inbox"
          description="Dump everything here?text, links, files, voice notes. We'll tag and organize it automatically with AI."
          tips={[
            "Hit the capture bar to add new content instantly",
            "AI tags appear within seconds of capture",
            "Swipe or click 'Nope' to archive items you don't need",
          ]}
        />

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

      <PageTour pageId="notes" steps={tourSteps} />
      <HelpCenter />
    </AppShell>
  );
}
