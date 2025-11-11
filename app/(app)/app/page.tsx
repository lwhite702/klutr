"use client";

import { useState, useRef, useMemo } from "react";
import type React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { ViewToggle, ViewType } from "@/components/ui/ViewToggle";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterChips } from "@/components/ui/FilterChips";
import { SortDropdown, SortOption, SortDirection } from "@/components/ui/SortDropdown";
import { QuickCaptureBar } from "@/components/notes/QuickCaptureBar";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { TourCallout } from "@/components/tour/TourCallout";
import { SectionTourDialog } from "@/components/onboarding/SectionTourDialog";
import { useSectionOnboarding } from "@/lib/hooks/useSectionOnboarding";
import { useSectionTour } from "@/lib/hooks/useSectionExperience";
import { getOnboardingSteps, getDialogTourSteps } from "@/lib/onboardingSteps";
import { mockNotes } from "@/lib/mockData";
import { Button } from "@/components/ui/button";

export default function AllNotesPage() {
  const [notes, setNotes] = useState(mockNotes);
  const [isCreating, setIsCreating] = useState(false);
  const [view, setView] = useState<ViewType>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<{ label: string; value: string }[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const quickCaptureRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  // Dialog tour for first-time onboarding (auto-starts)
  const dialogTour = useSectionTour("notes", getDialogTourSteps("notes"), {
    autoStart: true,
  });

  // Callout tour for contextual hints (manual trigger)
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
    autoTrigger: false,
  });

  const handleCreateNote = async (content: string) => {
    setIsCreating(true);
    console.log("TODO: Create note with content:", content);

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

  // Filter and sort logic
  const filteredAndSortedNotes = useMemo(() => {
    let result = [...notes];

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

    // Tag filters
    if (activeFilters.length > 0) {
      const filterValues = activeFilters.map((f) => f.value);
      result = result.filter((note) =>
        note.tags?.some((tag) => filterValues.includes(tag.label))
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
  }, [notes, searchQuery, activeFilters, sortBy, sortDirection]);

  const handleSortChange = (sort: SortOption, direction: SortDirection) => {
    setSortBy(sort);
    setSortDirection(direction);
  };

  const handleFilterRemove = (value: string) => {
    setActiveFilters(activeFilters.filter((f) => f.value !== value));
  };

  const handleFilterClear = () => {
    setActiveFilters([]);
  };

  // Quick filter buttons
  const quickFilters = [
    { label: "All", value: "all", onClick: () => setActiveFilters([]) },
    { label: "Pinned", value: "pinned", onClick: () => setActiveFilters([{ label: "Pinned", value: "pinned" }]) },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="All Notes"
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
        title="Welcome to Notes"
        subtitle="Your capture inbox for all thoughts, links, and files"
        accent="lime"
        tour={dialogTour}
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

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1 w-full">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search notes by title, description, or tags..."
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

        {/* Quick filters */}
        <div className="flex flex-wrap items-center gap-2">
          {quickFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={
                (filter.value === "all" && activeFilters.length === 0) ||
                activeFilters.some((f) => f.value === filter.value)
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={filter.onClick}
              className={
                (filter.value === "all" && activeFilters.length === 0) ||
                activeFilters.some((f) => f.value === filter.value)
                  ? "bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white"
                  : ""
              }
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Active filter chips */}
        <FilterChips
          filters={activeFilters}
          onRemove={handleFilterRemove}
          onClearAll={handleFilterClear}
        />
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

      {filteredAndSortedNotes.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>
            {searchQuery || activeFilters.length > 0
              ? "No notes match your filters. Try adjusting your search or filters."
              : "No notes yet. Add your first note above to get started."}
          </p>
        </div>
      )}
    </div>
  );
}
