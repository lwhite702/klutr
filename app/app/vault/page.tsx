"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { VaultLockScreen } from "@/components/vault/VaultLockScreen";
import { mockNotes } from "@/lib/mockData";
import { SectionSummary } from "@/components/onboarding/SectionSummary";
import { SectionTourDialog } from "@/components/onboarding/SectionTourDialog";
import { useSectionTour, type TourStep } from "@/lib/hooks/useSectionExperience";

const VAULT_TOUR_STEPS: TourStep[] = [
  {
    id: "unlock",
    title: "Unlock when you're ready",
    description: "Tap unlock on this device to view or add private notes - everything stays local-first until you say otherwise.",
  },
  {
    id: "privacy",
    title: "Nothing leaves your device",
    description: "Vault items skip AI automation entirely. Store the sensitive bits here without losing peace of mind.",
  },
  {
    id: "archive",
    title: "Archive forever",
    description: "Mark long-term keepers and keep them pinned. Vault is built for the memories you never want to misplace.",
  },
];

export default function VaultPage() {
  const [locked, setLocked] = useState(true);
  const vaultTour = useSectionTour("vault", VAULT_TOUR_STEPS);

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
        <>
          <div className="mx-auto flex max-w-5xl flex-col space-y-6">
            <SectionSummary
              sectionId="summary.vault"
              title="Vault basics"
              description="Vault is your hush-hush archive. Unlock locally to view or add items - nothing syncs to AI until you move it out."
              highlights={[
                "Unlock per device. We never ship Vault notes to the cloud.",
                "Perfect for personal records, contracts, and slow-burn ideas.",
                "You can promote items to stacks later if they need resurfacing.",
              ]}
              onStartTour={() => vaultTour.startTour({ restart: true })}
              tourCompleted={vaultTour.completed}
              accent="lime"
            />

            <PageHeader
              title="Vault"
              description="Your private, encrypted notes. Only you can unlock them."
            />
            <VaultLockScreen onUnlock={handleUnlock} />
          </div>

          <SectionTourDialog title="Vault walkthrough" accent="lime" tour={vaultTour} />
        </>
      </AppShell>
    );
  }

  return (
    <AppShell activeRoute="/app/vault">
      <>
        <div className="mx-auto flex max-w-5xl flex-col space-y-6">
          <SectionSummary
            sectionId="summary.vault"
            title="Vault basics"
            description="Vault is your hush-hush archive. Unlock locally to view or add items - nothing syncs to AI until you move it out."
            highlights={[
              "Unlock per device. We never ship Vault notes to the cloud.",
              "Perfect for personal records, contracts, and slow-burn ideas.",
              "You can promote items to stacks later if they need resurfacing.",
            ]}
            onStartTour={() => vaultTour.startTour({ restart: true })}
            tourCompleted={vaultTour.completed}
            accent="lime"
          />

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
            <div className="py-12 text-center text-muted-foreground">
              <p>
                No encrypted notes yet. Unlock your vault to see your private
                notes.
              </p>
            </div>
          )}
        </div>

        <SectionTourDialog title="Vault walkthrough" accent="lime" tour={vaultTour} />
      </>
    </AppShell>
  );
}
