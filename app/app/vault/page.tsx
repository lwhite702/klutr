"use client";

import { useState, useRef } from "react";
import type React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { VaultLockScreen } from "@/components/vault/VaultLockScreen";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { TourCallout } from "@/components/tour/TourCallout";
import { useSectionOnboarding } from "@/lib/hooks/useSectionOnboarding";
import { getOnboardingSteps } from "@/lib/onboardingSteps";
import { Button } from "@/components/ui/button";
import { mockNotes } from "@/lib/mockData";

export default function VaultPage() {
  const [locked, setLocked] = useState(true);
  const vaultLockRef = useRef<HTMLDivElement>(null);
  const unlockButtonRef = useRef<HTMLButtonElement>(null);

  const onboarding = useSectionOnboarding({
    section: "vault",
    steps: getOnboardingSteps("vault").map((step, idx) => {
      if (idx === 0)
        return {
          ...step,
          targetRef: vaultLockRef as React.RefObject<HTMLElement | null>,
        };
      if (idx === 1)
        return {
          ...step,
          targetRef: unlockButtonRef as React.RefObject<HTMLElement | null>,
        };
      return step;
    }),
  });

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
            actions={
              !onboarding.active && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onboarding.startOnboarding}
                >
                  Take tour
                </Button>
              )
            }
          />
          <SectionSummary
            section="vault"
            summary="Private, encrypted notes that only you can read. Everything is encrypted on your device before upload."
          />
          <div
            ref={vaultLockRef}
            data-onboarding="vault-lock"
            className="relative"
          >
            {onboarding.active &&
              onboarding.currentStep &&
              onboarding.step === 0 && (
                <TourCallout
                  title={onboarding.currentStep.title}
                  description={onboarding.currentStep.description}
                  position={onboarding.currentStep.position}
                  onNext={onboarding.nextStep}
                  onClose={onboarding.endOnboarding}
                  showNext={!onboarding.isLastStep}
                />
              )}
            <VaultLockScreen
              onUnlock={() => {
                handleUnlock();
                if (onboarding.active && onboarding.step === 1) {
                  setTimeout(() => {
                    const btn = document.querySelector(
                      '[data-onboarding="unlock-button"]'
                    ) as HTMLElement;
                    if (btn && unlockButtonRef.current) {
                      unlockButtonRef.current = btn as HTMLButtonElement;
                    }
                  }, 100);
                }
              }}
            />
          </div>
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
          actions={
            !onboarding.active && (
              <Button
                variant="outline"
                size="sm"
                onClick={onboarding.startOnboarding}
              >
                Take tour
              </Button>
            )
          }
        />
        <SectionSummary
          section="vault"
          summary="Private, encrypted notes that only you can read. Everything is encrypted on your device before upload."
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
