"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { QuickCaptureBar } from "@/components/notes/QuickCaptureBar";
import { mockNotes } from "@/lib/mockData";
import { SectionSummary } from "@/components/onboarding/SectionSummary";
import { useSectionTour, type TourStep } from "@/lib/hooks/useSectionExperience";
import { SectionTourDialog } from "@/components/onboarding/SectionTourDialog";

const NOTES_TOUR_STEPS: TourStep[] = [
  {
    id: "capture",
    title: "Capture anything",
    description: "Quick Capture grabs raw text, links, or files. Hit save and we store the context for you.",
  },
  {
    id: "tagging",
    title: "AI tags on save",
    description: "Once saved, Klutr's classifier tags the note and schedules stack updates so nothing gets lost.",
  },
  {
    id: "nope",
    title: "Need a reset? Nope it",
    description: "Use the note actions to Nope an item when you want it out of sight. You can revive it from the Nope bin anytime.",
  },
];

export default function AllNotesPage() {
  const [notes, setNotes] = useState(mockNotes);
  const [isCreating, setIsCreating] = useState(false);
  const notesTour = useSectionTour("notes", NOTES_TOUR_STEPS);

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
      <>
        <div className="mx-auto flex max-w-5xl flex-col space-y-6">
          <SectionSummary
            sectionId="summary.notes"
            title="Welcome to your Inbox"
            description="This is the dump zone for every half-baked idea, file, and brain-spark. Capture now, we organize later."
            highlights={[
              "Save anything in seconds with Quick Capture - Cmd/Ctrl + Enter is your shortcut.",
              "AI tags and stack placement happen automatically after each save.",
              "Not feeling it? Nope items to park them without deleting.",
            ]}
            onStartTour={() => notesTour.startTour({ restart: true })}
            tourCompleted={notesTour.completed}
            accent="indigo"
          />

          <PageHeader title="All Notes" description="Your universal inbox and launchpad." />

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
            <div className="py-12 text-center text-muted-foreground">
              <p>No notes yet. Add your first note above to get started.</p>
            </div>
          )}
        </div>

        <SectionTourDialog title="All Notes walkthrough" accent="indigo" tour={notesTour} />
      </>
    </AppShell>
  );
}
