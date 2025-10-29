"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { VaultLockScreen } from "@/components/vault/VaultLockScreen";
import { mockNotes } from "@/lib/mockData";

export default function VaultPage() {
  const [locked, setLocked] = useState(true);

  const handleUnlock = () => {
    console.log("TODO: Unlock vault");
    setLocked(false);
  };

  // Create locked-themed notes from mock data
  const lockedNotes = mockNotes.map((note) => ({
    ...note,
    tags: [
      ...note.tags,
      { label: "locked", colorClassName: "bg-red-100 text-red-800" },
    ],
    pinned: true,
  }));

  const handleNoteClick = (noteId: string) => {
    console.log("TODO: Decrypt and open vault note", noteId);
  };

  const handleNoteFavorite = (noteId: string) => {
    console.log("TODO: Toggle favorite for vault note", noteId);
  };

  if (locked) {
    return (
      <AppShell activeRoute="/app/vault">
        <div className="max-w-5xl mx-auto space-y-6">
          <PageHeader
            title="Vault"
            description="Your private, encrypted notes. Only you can unlock them."
          />
          <VaultLockScreen onUnlock={handleUnlock} />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell activeRoute="/app/vault">
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader
          title="Vault"
          description="Your private, encrypted notes. Only you can unlock them."
        />

        <CardGrid>
          {lockedNotes.map((note) => (
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

        {lockedNotes.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>
              No encrypted notes yet. Unlock your vault to see your private
              notes.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
