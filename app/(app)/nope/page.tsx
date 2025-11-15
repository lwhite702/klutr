"use client";

import { useState, useRef } from "react";
import type React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { TourCallout } from "@/components/tour/TourCallout";
import { SectionTourDialog } from "@/components/onboarding/SectionTourDialog";
import { useSectionOnboarding } from "@/lib/hooks/useSectionOnboarding";
import { useSectionTour } from "@/lib/hooks/useSectionExperience";
import { getOnboardingSteps, getDialogTourSteps } from "@/lib/onboardingSteps";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPatch } from "@/lib/clientApi";
import type { NoteDTO } from "@/lib/dto";
import { useEffect } from "react";

interface NopeNote {
  id: string;
  title: string;
  description: string;
  tags: Array<{ label: string; colorClassName?: string }>;
}

export default function NopeBinPage() {
  const [nopeNotes, setNopeNotes] = useState<NopeNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const nopeItemsRef = useRef<HTMLDivElement>(null);
  const restoreButtonRef = useRef<HTMLButtonElement>(null);

  // Dialog tour for first-time onboarding (auto-starts)
  const dialogTour = useSectionTour("nope", getDialogTourSteps("nope"), {
    autoStart: true,
  });

  // Callout tour for contextual hints (manual trigger)
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
    autoTrigger: false,
  });

  // Load nope notes on mount
  useEffect(() => {
    loadNopeNotes();
  }, []);

  async function loadNopeNotes() {
    try {
      setIsLoading(true);
      // Filter for notes with type='nope'
      const response = await apiGet<NoteDTO[]>('/api/notes/list?type=nope');
      
      const notesData: NopeNote[] = response.map(note => ({
        id: note.id,
        title: note.content.slice(0, 50) + (note.content.length > 50 ? '...' : ''),
        description: note.content,
        tags: [
          ...note.tags.map(t => ({ label: t })),
          { label: "discarded", colorClassName: "bg-gray-100 text-gray-800" },
        ],
      }));
      
      setNopeNotes(notesData);
    } catch (error) {
      console.error('[Nope] Load notes error:', error);
      toast.error('Failed to load discarded notes');
    } finally {
      setIsLoading(false);
    }
  }

  const handleRestore = async (noteId: string) => {
    try {
      // Change type from 'nope' back to 'misc'
      await apiPatch<NoteDTO>(`/api/notes/${noteId}`, {
        type: 'misc',
      });
      
      setNopeNotes(nopeNotes.filter((note) => note.id !== noteId));
      toast.success('Note restored');
    } catch (error) {
      console.error('[Nope] Restore error:', error);
      toast.error('Failed to restore note');
    }
  };

  const handleNoteClick = (noteId: string) => {
    toast.info('Note details coming soon');
  };

  const handleNoteFavorite = (noteId: string) => {
    toast.info('Favorites coming soon');
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-8">
        {/* Fintask-inspired page header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-2">Nope Bin</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Stuff you set aside. Nothing is permanently deleted.
            </p>
          </div>
          {!onboarding.active && !dialogTour.open && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => dialogTour.startTour()}
              className="shrink-0"
            >
              Take tour
            </Button>
          )}
        </div>

        <SectionTourDialog
          title="Welcome to Nope Bin"
          subtitle="Notes you've set aside. Nothing is permanently deleted"
          accent="indigo"
          tour={dialogTour}
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
  );
}
