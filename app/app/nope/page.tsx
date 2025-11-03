"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { Button } from "@/components/ui/button";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { PageTour } from "@/components/tour/PageTour";
import { HelpCenter } from "@/components/help/HelpCenter";
import { mockNotes } from "@/lib/mockData";
import { RotateCcw } from "lucide-react";

const tourSteps = [
  {
    id: "welcome",
    title: "Welcome to the Nope Bin!",
    description: "This is where items you've swiped away end up. Think of it as a safety net?nothing is truly gone until you say so.",
  },
  {
    id: "restore",
    title: "Easy Restoration",
    description: "Made a mistake? Click 'Restore' on any item to bring it back to your main Notes. No harm, no foul.",
  },
  {
    id: "auto-delete",
    title: "Auto-Cleanup",
    description: "Items in the Nope Bin are auto-deleted after 30 days to keep things tidy. Until then, you can restore anything anytime.",
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
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader title="Nope Bin" description="Stuff you set aside." />

        <SectionSummary
          pageId="nope"
          title="Your Safety Net for Mistakes"
          description="Nope'd something you actually need? No worries?everything stays here for 30 days. Restore anytime or let it auto-delete."
          tips={[
            "Click 'Restore' to bring items back to Notes",
            "Items auto-delete after 30 days",
            "Review this bin periodically to catch accidental swipes",
          ]}
        />

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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestore(note.id);
                  }}
                  aria-label="Restore note"
                >
                  <RotateCcw className="mr-1 h-3 w-3" />
                  Restore
                </Button>
              }
            />
          ))}
        </CardGrid>

        {nopeNotes.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Your Nope Bin is empty. Nothing has been discarded yet.</p>
          </div>
        )}
      </div>

      <PageTour pageId="nope" steps={tourSteps} />
      <HelpCenter />
    </AppShell>
  );
}
