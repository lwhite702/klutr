"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { NoteCard } from "@/components/notes/NoteCard"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { NoteDTO } from "@/types/note"
import { apiGet, apiPatch } from "@/lib/clientApi"
import { isDemoMode } from "@/lib/onboarding"
import { HelpCircle, RotateCcw } from "lucide-react"

const MOCK_NOTES: NoteDTO[] = [
  {
    id: "1",
    content: "Maybe start a newsletter? Nah, too much work and everyone has one already.",
    type: "nope",
    archived: true,
    createdAt: "2025-10-17T15:30:00Z",
    tags: ["content"],
    cluster: null,
    clusterConfidence: null,
    clusterUpdatedAt: null,
  },
  {
    id: "2",
    content: "Build a Chrome extension for... actually, no one uses Chrome extensions anymore.",
    type: "nope",
    archived: true,
    createdAt: "2025-10-15T09:20:00Z",
    tags: ["product"],
    cluster: null,
    clusterConfidence: null,
    clusterUpdatedAt: null,
  },
  {
    id: "3",
    content: "Learn Rust. Too time-consuming right now, maybe later.",
    type: "nope",
    archived: true,
    createdAt: "2025-10-12T14:45:00Z",
    tags: ["learning"],
    cluster: null,
    clusterConfidence: null,
    clusterUpdatedAt: null,
  },
]

export default function NopeBinPage() {
  const [notes, setNotes] = useState<NoteDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [restoringIds, setRestoringIds] = useState<Set<string>>(new Set())
  const demoMode = isDemoMode()

  useEffect(() => {
    async function loadNopeNotes() {
      if (demoMode) {
        setNotes(MOCK_NOTES)
        setIsLoading(false)
        return
      }

      try {
        const data = await apiGet<NoteDTO[]>("/api/notes/nope")
        setNotes(data)
      } catch (error) {
        console.error("[v0] Failed to load nope notes:", error)
        setNotes(MOCK_NOTES)
      } finally {
        setIsLoading(false)
      }
    }

    loadNopeNotes()
  }, [demoMode])

  const handleRestore = async (noteId: string) => {
    if (demoMode) {
      console.log("[v0] Demo mode: restore note", noteId)
      setNotes(notes.filter((n) => n.id !== noteId))
      return
    }

    setRestoringIds(new Set(restoringIds).add(noteId))
    try {
      await apiPatch("/api/notes/update", {
        id: noteId,
        archived: false,
        type: "misc",
      })
      // Remove from list
      setNotes(notes.filter((n) => n.id !== noteId))
    } catch (error) {
      console.error("[v0] Failed to restore note:", error)
    } finally {
      setRestoringIds((prev) => {
        const next = new Set(prev)
        next.delete(noteId)
        return next
      })
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-24 bg-muted rounded" />
          <div className="h-24 bg-muted rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Nope Bin</h1>
          <p className="text-muted-foreground">Stuff we've safely shelved. You can restore it later.</p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">This is the mental compost heap. You can always pull something back out.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
              <div className="absolute top-4 right-4 z-10">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRestore(note.id)}
                  disabled={restoringIds.has(note.id)}
                >
                  <RotateCcw className="mr-1 h-3 w-3" />
                  Restore
                </Button>
              </div>
              <NoteCard note={note} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {notes.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Your Nope Bin is empty. Nothing has been archived yet.</p>
        </div>
      )}
    </div>
  )
}
