"use client";

import { useState, useRef, useMemo } from "react";
import type React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { ViewToggle, ViewType } from "@/components/ui/ViewToggle";
import { SearchBar } from "@/components/ui/SearchBar";
import { SortDropdown, SortOption, SortDirection } from "@/components/ui/SortDropdown";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { TourCallout } from "@/components/tour/TourCallout";
import { SectionTourDialog } from "@/components/onboarding/SectionTourDialog";
import { useSectionOnboarding } from "@/lib/hooks/useSectionOnboarding";
import { useSectionTour } from "@/lib/hooks/useSectionExperience";
import { getOnboardingSteps, getDialogTourSteps } from "@/lib/onboardingSteps";
import { Button } from "@/components/ui/button";
import { mockStacks } from "@/lib/mockData";

export default function SmartStacksPage() {
  const [stacks, setStacks] = useState(mockStacks);
  const [view, setView] = useState<ViewType>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("title");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const stacksRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  // Dialog tour for first-time onboarding (auto-starts)
  const dialogTour = useSectionTour("stacks", getDialogTourSteps("stacks"), {
    autoStart: true,
  });

  // Callout tour for contextual hints (manual trigger)
  const onboarding = useSectionOnboarding({
    section: "stacks",
    steps: getOnboardingSteps("stacks").map((step, idx) => {
      if (idx === 0)
        return {
          ...step,
          targetRef: stacksRef as React.RefObject<HTMLElement | null>,
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

  const handleStackClick = (stackName: string) => {
    console.log("TODO: Navigate to stack detail", stackName);
    window.location.href = `/app/stacks/${stackName
      .toLowerCase()
      .replace(/\s+/g, "-")}`;
  };

  const handleStackFavorite = (stackId: string) => {
    console.log("TODO: Toggle favorite for stack", stackId);
    setStacks(
      stacks.map((stack) =>
        stack.id === stackId ? { ...stack, pinned: !stack.pinned } : stack
      )
    );
  };

  // Filter and sort logic
  const filteredAndSortedStacks = useMemo(() => {
    let result = [...stacks];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (stack) =>
          stack.name.toLowerCase().includes(query) ||
          stack.description?.toLowerCase().includes(query) ||
          stack.tags?.some((tag) => tag.label.toLowerCase().includes(query))
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "title":
          comparison = a.name.localeCompare(b.name);
          break;
        case "tags":
          comparison = (a.tags?.length || 0) - (b.tags?.length || 0);
          break;
        case "pinned":
          comparison = (a.pinned ? 1 : 0) - (b.pinned ? 1 : 0);
          break;
        case "date":
        default:
          comparison = a.id.localeCompare(b.id);
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    // Pinned items first
    if (sortBy !== "pinned") {
      result.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    }

    return result;
  }, [stacks, searchQuery, sortBy, sortDirection]);

  const handleSortChange = (sort: SortOption, direction: SortDirection) => {
    setSortBy(sort);
    setSortDirection(direction);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Stacks"
        description="Your saved collections."
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
        title="Welcome to Stacks"
        subtitle="Collections of related notes organized by tags"
        accent="lime"
        tour={dialogTour}
      />

      <SectionSummary
        section="stacks"
        summary="Collections of related notes organized by tags and categories. Pin important stacks for quick access."
      />

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 w-full">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search stacks..."
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

      <div ref={stacksRef} data-onboarding="stacks" className="relative">
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

      <CardGrid view={view}>
        {filteredAndSortedStacks.map((stack) => (
          <ItemCard
            key={stack.id}
            title={stack.name}
            description={stack.description}
            tags={stack.tags}
            pinned={stack.pinned}
            onClick={() => handleStackClick(stack.name)}
            onFavorite={() => handleStackFavorite(stack.id)}
            variant={view}
          />
        ))}
      </CardGrid>

      {onboarding.active &&
        onboarding.currentStep &&
        onboarding.step === 2 && (
          <div className="relative" data-onboarding="pin-button">
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

      {filteredAndSortedStacks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>
            {searchQuery
              ? "No stacks match your search. Try a different query."
              : "No stacks yet. Create some notes and run \"Re-cluster now\" to generate stacks."}
          </p>
        </div>
      )}
    </div>
  );
}
