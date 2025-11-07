"use client";

import { useState, useRef, useMemo } from "react";
import type React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { ViewToggle, ViewType } from "@/components/ui/ViewToggle";
import { SearchBar } from "@/components/ui/SearchBar";
import { SortDropdown, SortOption, SortDirection } from "@/components/ui/SortDropdown";
import { VaultLockScreen } from "@/components/vault/VaultLockScreen";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { TourCallout } from "@/components/tour/TourCallout";
import { SectionTourDialog } from "@/components/onboarding/SectionTourDialog";
import { useSectionOnboarding } from "@/lib/hooks/useSectionOnboarding";
import { useSectionTour } from "@/lib/hooks/useSectionExperience";
import { getOnboardingSteps, getDialogTourSteps } from "@/lib/onboardingSteps";
import { Button } from "@/components/ui/button";
import { mockNotes } from "@/lib/mockData";

export default function VaultPage() {
  const [locked, setLocked] = useState(true);
  const [view, setView] = useState<ViewType>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const vaultLockRef = useRef<HTMLDivElement>(null);
  const unlockButtonRef = useRef<HTMLButtonElement>(null);

  // Dialog tour for first-time onboarding (auto-starts)
  const dialogTour = useSectionTour("vault", getDialogTourSteps("vault"), {
    autoStart: true,
  });

  // Callout tour for contextual hints (manual trigger)
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
    autoTrigger: false,
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

  // Filter and sort logic
  const filteredAndSortedNotes = useMemo(() => {
    let result = [...lockedNotes];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.description?.toLowerCase().includes(query) ||
          note.tags?.some((tag) => tag.label.toLowerCase().includes(query))
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "tags":
          comparison = (a.tags?.length || 0) - (b.tags?.length || 0);
          break;
        case "pinned":
          comparison = (a.pinned ? 1 : 0) - (b.pinned ? 1 : 0);
          break;
        case "date":
        default:
          comparison = parseInt(a.id) - parseInt(b.id);
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    // Pinned items first
    if (sortBy !== "pinned") {
      result.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    }

    return result;
  }, [lockedNotes, searchQuery, sortBy, sortDirection]);

  const handleSortChange = (sort: SortOption, direction: SortDirection) => {
    setSortBy(sort);
    setSortDirection(direction);
  };

  if (locked) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader
          title="Vault"
          description="Your private, encrypted notes. Only you can unlock them."
          actions={
            !onboarding.active && !dialogTour.open && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => dialogTour.startTour()}
              >
                Take tour
              </Button>
            )
          }
        />

        <SectionTourDialog
          title="Welcome to Vault"
          subtitle="Private, encrypted notes that only you can read"
          accent="coral"
          tour={dialogTour}
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
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Vault"
        description="Your private, encrypted notes. Only you can unlock them."
        actions={
          !onboarding.active && !dialogTour.open && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => dialogTour.startTour()}
            >
              Take tour
            </Button>
          )
        }
      />

      <SectionTourDialog
        title="Welcome to Vault"
        subtitle="Private, encrypted notes that only you can read"
        accent="coral"
        tour={dialogTour}
      />

      <SectionSummary
        section="vault"
        summary="Private, encrypted notes that only you can read. Everything is encrypted on your device before upload."
      />

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 w-full">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search vault notes..."
          />
        </div>
        <div className="flex items-center gap-2">
          <SortDropdown
            sortBy={sortBy}
            direction={sortDirection}
            onSortChange={handleSortChange}
          />
          <ViewToggle
            view={view}
            onViewChange={setView}
            availableViews={["grid", "list", "collage"]}
          />
        </div>
      </div>

      <CardGrid view={view}>
        {filteredAndSortedNotes.map((note) => (
          <ItemCard
            key={note.id}
            title={note.title}
            description={note.description}
            tags={note.tags}
            pinned={note.pinned}
            onClick={() => handleNoteClick(note.id)}
            onFavorite={() => handleNoteFavorite(note.id)}
            variant={view}
          />
        ))}
      </CardGrid>

      {filteredAndSortedNotes.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>
            {searchQuery
              ? "No notes match your search. Try adjusting your search query."
              : "No encrypted notes yet. Unlock your vault to see your private notes."}
          </p>
        </div>
      )}
    </div>
  );
}
