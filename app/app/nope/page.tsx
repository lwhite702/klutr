"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { Button } from "@/components/ui/button";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { SectionTour } from "@/components/tour/SectionTour";
import { mockNotes } from "@/lib/mockData";
import { RotateCcw } from "lucide-react";

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

  const tourSteps = [
    {
      id: "nope-review",
      targetId: "nope-content",
      title: "Review Discarded Items",
      description: "All notes you've 'Nope'd' end up here. You can review them to make sure nothing important was accidentally discarded.",
      position: "bottom" as const,
    },
    {
      id: "nope-restore",
      targetId: "nope-content",
      title: "Restore or Delete",
      description: "Click 'Restore' on any note to bring it back to your inbox. Items in the Nope Bin are kept for a while, but you can permanently delete them if you're sure.",
      position: "bottom" as const,
    },
  ];

  return (
    <AppShell activeRoute="/app/nope">
      <SectionTour section="nope" steps={tourSteps} autoStart={true} />
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader title="Nope Bin" description="Stuff you set aside." />

        <SectionSummary
          title="Trash & Archive"
          description="All notes you've 'Nope'd' end up here. Review them to make sure nothing important was accidentally discarded. Click 'Restore' on any note to bring it back to your inbox with its original tags intact. Items are kept for a while, but you can permanently delete them if you're sure."
          storageKey="nope"
        />

        <div id="nope-content">
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
        </div>

        {nopeNotes.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Your Nope Bin is empty. Nothing has been discarded yet.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
