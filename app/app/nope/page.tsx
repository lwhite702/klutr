"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { Button } from "@/components/ui/button";
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

  return (
    <AppShell activeRoute="/app/nope">
      <div className="max-w-5xl mx-auto space-y-6">
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
    </AppShell>
  );
}
