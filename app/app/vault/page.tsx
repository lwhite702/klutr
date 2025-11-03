"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { VaultLockScreen } from "@/components/vault/VaultLockScreen";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { PageTour } from "@/components/tour/PageTour";
import { HelpCenter } from "@/components/help/HelpCenter";
import { mockNotes } from "@/lib/mockData";

const tourSteps = [
  {
    id: "welcome",
    title: "Welcome to the Vault!",
    description: "Your ultra-private archive with local-first encryption. These notes are stored securely and only you have the key.",
  },
  {
    id: "unlock",
    title: "Unlock to Access",
    description: "The Vault stays locked until you open it. All data is encrypted at rest and only decrypted when you need it?true privacy by design.",
  },
  {
    id: "storage",
    title: "Long-Term Storage",
    description: "Use the Vault for sensitive notes you want to keep forever. Great for passwords, personal reflections, or confidential research.",
  },
];

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
          <SectionSummary
            pageId="vault"
            title="Local-First Privacy Archive"
            description="The Vault uses end-to-end encryption to protect your most sensitive notes. Data is encrypted locally before sync?we never see your content."
            tips={[
              "All vault notes are encrypted at rest",
              "Only you have the decryption key",
              "Perfect for passwords, private journals, or sensitive research",
            ]}
          />
          <VaultLockScreen onUnlock={handleUnlock} />
        </div>
        <PageTour pageId="vault" steps={tourSteps} />
        <HelpCenter />
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

        <SectionSummary
          pageId="vault"
          title="Local-First Privacy Archive"
          description="The Vault uses end-to-end encryption to protect your most sensitive notes. Data is encrypted locally before sync?we never see your content."
          tips={[
            "All vault notes are encrypted at rest",
            "Only you have the decryption key",
            "Perfect for passwords, private journals, or sensitive research",
          ]}
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

      <PageTour pageId="vault" steps={tourSteps} />
      <HelpCenter />
    </AppShell>
  );
}
