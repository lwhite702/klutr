"use client";

import { useState, useRef } from "react";
import type React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { QuickCaptureBar } from "@/components/notes/QuickCaptureBar";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { TourCallout } from "@/components/tour/TourCallout";
import { useSectionOnboarding } from "@/lib/hooks/useSectionOnboarding";
import { getOnboardingSteps } from "@/lib/onboardingSteps";
import { mockNotes } from "@/lib/mockData";
import { Button } from "@/components/ui/button";

export default function AllNotesPage() {
  const [notes, setNotes] = useState(mockNotes);
  const [isCreating, setIsCreating] = useState(false);
  const quickCaptureRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  const onboarding = useSectionOnboarding({
    section: "notes",
    steps: getOnboardingSteps("notes").map((step, idx) => {
      if (idx === 0)
        return {
          ...step,
          targetRef: quickCaptureRef as React.RefObject<HTMLElement | null>,
        };
      if (idx === 1)
        return {
          ...step,
          targetRef: tagsRef as React.RefObject<HTMLElement | null>,
        };
      return step;
    }),
  });

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
        <PageHeader
          title="All Notes"
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
          section="notes"
          summary="Your capture inbox is where you dump thoughts, files or voice notes. We tag them and file them for later."
        />

        <div
          ref={quickCaptureRef}
          data-onboarding="quick-capture"
          className="relative"
        >
          <QuickCaptureBar
            onCreate={handleCreateNote}
            isCreating={isCreating}
          />
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
        </div>

        <div ref={tagsRef} data-onboarding="tags" className="relative">
          {onboarding.active &&
            onboarding.currentStep &&
            onboarding.step === 1 && (
              <TourCallout
                title={onboarding.currentStep.title}
                description={onboarding.currentStep.description}
                position={onboarding.currentStep.position}
                onNext={onboarding.nextStep}
                onClose={onboarding.endOnboarding}
                showNext={!onboarding.isLastStep}
              />
            )}
        </div>

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

        {onboarding.active &&
          onboarding.currentStep &&
          onboarding.step === 2 && (
            <div className="relative" data-onboarding="nope-action">
              <TourCallout
                title={onboarding.currentStep.title}
                description={onboarding.currentStep.description}
                position={onboarding.currentStep.position}
                onNext={onboarding.nextStep}
                onClose={onboarding.endOnboarding}
                showNext={!onboarding.isLastStep}
              />
            </div>
          )}

        {notes.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No notes yet. Add your first note above to get started.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
