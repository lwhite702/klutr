"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Root /app route - redirects to /app/stream
 * Stream is now the central hub with panel overlays
 */
export default function AppRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/app/stream');
  }, [router]);

  return null;
}
  const [notes, setNotes] = useState<Note[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  // Load notes on mount
  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    try {
      setIsLoading(true);
      const response = await apiGet<NoteDTO[]>('/api/notes/list?limit=100');
      
      const notesData: Note[] = response.map(note => ({
        id: note.id,
        content: note.content,
        type: note.type,
        tags: note.tags.map(t => ({ label: t })),
        createdAt: new Date(note.createdAt),
        archived: note.archived,
      }));
      
      setNotes(notesData);
    } catch (error) {
      console.error('[Dashboard] Load notes error:', error);
      toast.error('Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  }

  const handleCreateNote = async (content: string) => {
    setIsCreating(true);
    
    try {
      const response = await apiPost<NoteDTO>('/api/notes/create', {
        content,
        type: 'misc',
      });
      
      const newNote: Note = {
        id: response.id,
        content: response.content,
        type: response.type,
        tags: response.tags.map(t => ({ label: t })),
        createdAt: new Date(response.createdAt),
        archived: response.archived,
      };
      
      setNotes([newNote, ...notes]);
      toast.success('Note created');
    } catch (error) {
      console.error('[Dashboard] Create note error:', error);
      toast.error('Failed to create note');
    } finally {
      setIsCreating(false);
    }
  };

  const handleNoteClick = (noteId: string) => {
    // Navigate to note detail or expand inline
    toast.info('Note details coming soon');
  };

  const handleNoteFavorite = (noteId: string) => {
    // TODO: Implement pinning API
    toast.info('Pinning notes coming soon');
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
