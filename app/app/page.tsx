"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { NoteDTO } from "@/types/note"
import { QuickCaptureBar } from "@/components/notes/QuickCaptureBar"
import { NoteCard } from "@/components/notes/NoteCard"
import { FirstRunHelper } from "@/components/notes/FirstRunHelper"
import { TourCallout } from "@/components/tour/TourCallout"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiGet, apiPost } from "@/lib/clientApi"
import { isDemoMode, hasSeenOnboarding, markOnboardingSeen } from "@/lib/onboarding"
import { useGuidedTour } from "@/lib/useGuidedTour"

const MOCK_NOTES: NoteDTO[] = [
  {
    id: "1",
    content:
      "Build a SaaS product that helps creators repurpose their content across platforms. Maybe use AI to auto-generate captions?",
    type: "idea",
    archived: false,
    createdAt: "2025-10-24T10:30:00Z",
    tags: ["saas", "ai", "content"],
    cluster: "Ideas",
    clusterConfidence: 0.87,
    clusterUpdatedAt: "2025-10-24T11:00:00Z",
  },
  {
    id: "2",
    content: "Call Sarah about the freelance project deadline - she mentioned Friday but need to confirm",
    type: "task",
    archived: false,
    createdAt: "2025-10-23T14:20:00Z",
    tags: ["work", "urgent"],
    cluster: "Tasks",
    clusterConfidence: 0.92,
    clusterUpdatedAt: "2025-10-23T14:30:00Z",
  },
  {
    id: "3",
    content: "John Doe - john@example.com - Met at the conference, interested in collaborating on AI projects",
    type: "contact",
    archived: false,
    createdAt: "2025-10-22T16:45:00Z",
    tags: ["networking", "ai"],
    cluster: "Contacts",
    clusterConfidence: 0.95,
    clusterUpdatedAt: "2025-10-22T17:00:00Z",
  },
]

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteDTO[]>([])
  const [filterType, setFilterType] = useState<string>("all")
  const [filterCluster, setFilterCluster] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [pendingOps, setPendingOps] = useState<Map<string, { classifying?: boolean }>>(new Map())

  const demoMode = isDemoMode()
  const tour = useGuidedTour(notes.length)

  useEffect(() => {
    async function loadNotes() {
      if (demoMode) {
        setNotes(MOCK_NOTES)
        setIsLoading(false)
        return
      }

      try {
        const params = new URLSearchParams()
        if (filterType !== "all") params.set("type", filterType)
        if (filterCluster !== "all") params.set("cluster", filterCluster)

        const data = await apiGet<NoteDTO[]>(`/api/notes/list?${params}`)
        setNotes(data)
      } catch (error) {
        console.error("[v0] Failed to load notes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadNotes()
  }, [filterType, filterCluster, demoMode])

  const handleCreateNote = async (content: string) => {
    setIsCreating(true)
    try {
      if (demoMode) {
        // Demo mode: add mock note locally
        const newNote: NoteDTO = {
          id: Date.now().toString(),
          content,
          type: "unclassified",
          archived: false,
          createdAt: new Date().toISOString(),
          tags: [],
          cluster: null,
          clusterConfidence: null,
          clusterUpdatedAt: null,
        }
        setNotes([newNote, ...notes])
        return
      }

      // Real mode: create via API
      const newNote = await apiPost<NoteDTO>("/api/notes/create", { content })
      setNotes([newNote, ...notes])

      // Auto-classify in background
      setPendingOps(new Map(pendingOps.set(newNote.id, { classifying: true })))
      try {
        const classified = await apiPost<NoteDTO>("/api/notes/classify", { id: newNote.id })
        // Update note with classification
        setNotes((prev) => prev.map((n) => (n.id === classified.id ? classified : n)))
      } catch (error) {
        console.error("[v0] Failed to classify note:", error)
      } finally {
        setPendingOps((prev) => {
          const next = new Map(prev)
          next.delete(newNote.id)
          return next
        })
      }
    } catch (error) {
      console.error("[v0] Failed to create note:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleCreateExample = async () => {
    const exampleContent =
      "Call Jordan about the podcast sponsorship idea Friday 3pm. Budget 2k. Mention analytics package."
    await handleCreateNote(exampleContent)
    markOnboardingSeen()
  }

  const filteredNotes = notes.filter((note) => {
    if (filterType !== "all" && note.type !== filterType) return false
    if (filterCluster !== "all" && note.cluster !== filterCluster) return false
    return true
  })

  const showFirstRun = notes.length === 0 && !hasSeenOnboarding() && !demoMode && !isLoading

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-32 bg-muted rounded" />
          <div className="h-24 bg-muted rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Notes</h1>
        <p className="text-muted-foreground">Capture everything. We'll organize it.</p>
      </div>

      {showFirstRun ? (
        <FirstRunHelper onCreateExample={handleCreateExample} />
      ) : (
        <>
          <div className="relative">
            <QuickCaptureBar onCreate={handleCreateNote} isCreating={isCreating} />
            {tour.active && tour.step === 1 && (
              <TourCallout
                title="Step 1: Dump anything here"
                description="Type a thought, task, link, or idea. We'll organize it automatically with AI."
                position="bottom"
                onNext={tour.nextStep}
                onClose={tour.endTour}
              />
            )}
          </div>

          <div className="relative flex gap-3">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="idea">Idea</SelectItem>
                <SelectItem value="task">Task</SelectItem>
                <SelectItem value="contact">Contact</SelectItem>
                <SelectItem value="link">Link</SelectItem>
                <SelectItem value="voice">Voice</SelectItem>
                <SelectItem value="misc">Misc</SelectItem>
                <SelectItem value="nope">Nope</SelectItem>
                <SelectItem value="unclassified">Unclassified</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCluster} onValueChange={setFilterCluster}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by cluster" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All clusters</SelectItem>
                <SelectItem value="Ideas">Ideas</SelectItem>
                <SelectItem value="Tasks">Tasks</SelectItem>
                <SelectItem value="Contacts">Contacts</SelectItem>
                <SelectItem value="Links">Links</SelectItem>
                <SelectItem value="Images">Images</SelectItem>
                <SelectItem value="Voice">Voice</SelectItem>
                <SelectItem value="Misc">Misc</SelectItem>
              </SelectContent>
            </Select>

            {tour.active && tour.step === 2 && (
              <TourCallout
                title="Step 2: Filter by meaning"
                description="No folders. Just filter by what it is (type) or what it's about (cluster)."
                position="bottom"
                onNext={tour.nextStep}
                onClose={tour.endTour}
              />
            )}
          </div>

          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {filteredNotes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <NoteCard note={note} isPending={pendingOps.get(note.id)?.classifying} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredNotes.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No notes match your filters. Try adjusting them or create a new note.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
