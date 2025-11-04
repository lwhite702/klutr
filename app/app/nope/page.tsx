"use client";

import { useState, useRef } from "react";
import type React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { TourCallout } from "@/components/tour/TourCallout";
import { useSectionOnboarding } from "@/lib/hooks/useSectionOnboarding";
import { getOnboardingSteps } from "@/lib/onboardingSteps";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const nopeItemsRef = useRef<HTMLDivElement>(null);
  const restoreButtonRef = useRef<HTMLButtonElement>(null);

  const onboarding = useSectionOnboarding({
    section: "nope",
    steps: getOnboardingSteps("nope").map((step, idx) => {
      if (idx === 0)
        return {
          ...step,
          targetRef: nopeItemsRef as React.RefObject<HTMLElement | null>,
        };
      if (idx === 1)
        return {
          ...step,
          targetRef: restoreButtonRef as React.RefObject<HTMLElement | null>,
        };
      return step;
    }),
  });

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
        <PageHeader
          title="Nope Bin"
          description="Stuff you set aside."
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
          section="nope"
          summary="Notes you've set aside. Nothing is permanently deleted—restore anything you've archived."
        />

        <div
          ref={nopeItemsRef}
          data-onboarding="nope-items"
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
        </div>

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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        ref={
                          note.id === nopeNotes[0]?.id
                            ? restoreButtonRef
                            : undefined
                        }
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestore(note.id);
                        }}
                        aria-label="Restore note"
                        data-onboarding={
                          note.id === nopeNotes[0]?.id
                            ? "restore-button"
                            : undefined
                        }
                        className="relative"
                      >
                        <RotateCcw className="mr-1 h-3 w-3" />
                        Restore
                        {onboarding.active &&
                          onboarding.currentStep &&
                          onboarding.step === 1 &&
                          note.id === nopeNotes[0]?.id && (
                            <TourCallout
                              title={onboarding.currentStep.title}
                              description={onboarding.currentStep.description}
                              position={onboarding.currentStep.position}
                              onNext={onboarding.nextStep}
                              onClose={onboarding.endOnboarding}
                              showNext={!onboarding.isLastStep}
                            />
                          )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Restore this note to bring it back to your main notes.
                        Nothing is permanently deleted.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
