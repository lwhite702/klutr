"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { Button } from "@/components/ui/button";
import { mockNotes } from "@/lib/mockData";
import { RotateCcw } from "lucide-react";
import { SectionSummary } from "@/components/onboarding/SectionSummary";
import { useSectionTour, type TourStep } from "@/lib/hooks/useSectionExperience";
import { SectionTourDialog } from "@/components/onboarding/SectionTourDialog";
import { Hint } from "@/components/ui/hint";

const NOPE_TOUR_STEPS: TourStep[] = [
  {
    id: "review",
    title: "Review on your terms",
    description: "This is the cooling-off bin. Give yourself space before deciding what's next.",
  },
  {
    id: "restore",
    title: "Restore when ready",
    description: "Use Restore to pull a note back into circulation - it drops right into the Inbox with its tags intact.",
  },
  {
    id: "purge",
    title: "Permanently delete",
    description: "Once you're sure, deep clean to purge a note forever. Until then, everything's recoverable.",
  },
];

export default function NopeBinPage() {
  const [nopeNotes, setNopeNotes] = useState(
    mockNotes.map((note) => ({
      ...note,
      tags: [
        ...note.tags,
        { label: "discarded", colorClassName: "bg-gray-100 text-gray-800" },
      ],
    }))
  );
  const nopeTour = useSectionTour("nope", NOPE_TOUR_STEPS);

  const handleRestore = (noteId: string) => {
    console.log("TODO: Restore note", noteId);
    setNopeNotes(nopeNotes.filter((note) => note.id !== noteId));
  };

  const handleNoteClick = (noteId: string) => {
    console.log("TODO: Open discarded note", noteId);
  };

  const handleNoteFavorite = (noteId: string) => {
    console.log("TODO: Toggle favorite for discarded note", noteId);
  };

  return (
    <AppShell activeRoute="/app/nope">
      <>
        <div className="mx-auto flex max-w-5xl flex-col space-y-6">
          <SectionSummary
            sectionId="summary.nope"
            title="Nope Bin etiquette"
            description="This is the buffer zone for ideas you aren't ready to delete. Circle back when you're ready to restore or release them."
            highlights={[
              "Everything in Nope is recoverable until you delete it for good.",
              "Use Nope to experiment freely without cluttering the inbox.",
              "Review weekly to promote keepers or clear the decks.",
            ]}
            onStartTour={() => nopeTour.startTour({ restart: true })}
            tourCompleted={nopeTour.completed}
            accent="coral"
          />

          <PageHeader title="Nope Bin" description="Stuff you set aside." />

          <CardGrid>
            {nopeNotes.map((note) => (
              <ItemCard
                key={note.id}
                title={note.title}
                description={note.description}
                tags={note.tags}
                pinned={note.pinned}
                onClick={() => handleNoteClick(note.id)}
                onFavorite={() => handleNoteFavorite(note.id)}
                actionsRight={
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(note.id);
                      }}
                      aria-label="Restore note"
                      className="border-[var(--color-lime)] text-[var(--color-lime)] hover:bg-[var(--color-lime)]/10"
                    >
                      <RotateCcw className="mr-1 h-3 w-3" />
                      Restore
                    </Button>
                    <Hint
                      title="Restoring"
                      message="Restored notes jump back into the inbox with all their AI tags intact."
                    />
                  </div>
                }
              />
            ))}
          </CardGrid>

          {nopeNotes.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              <p>Your Nope Bin is empty. Nothing has been discarded yet.</p>
            </div>
          )}
        </div>

        <SectionTourDialog title="Nope Bin walkthrough" accent="coral" tour={nopeTour} />
      </>
    </AppShell>
  );
}
