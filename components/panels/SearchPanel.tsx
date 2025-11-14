'use client'

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { StreamMessage } from "@/components/stream/StreamMessage"
import { Search as SearchIcon, Loader2 } from "lucide-react"
import { apiGet } from "@/lib/clientApi"
import type { StreamDrop } from "@/lib/mockData"
import type { NoteDTO } from "@/lib/dto"

interface SearchPanelProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Search Panel - Command palette style search
 * Extracted from /search page for hybrid architecture
 * 
 * Special design: Full-screen modal instead of sidebar
 * Optimized for keyboard navigation
 */
export function SearchPanel({ isOpen, onClose }: SearchPanelProps) {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [results, setResults] = useState<StreamDrop[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Reset when panel closes
  useEffect(() => {
    if (!isOpen) {
      setQuery("")
      setResults([])
    }
  }, [isOpen])

  // Perform search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      setError(null)
      setIsSearching(false)
      return
    }

    let canceled = false

    const performSearch = async () => {
      try {
        setIsSearching(true)
        setError(null)
        
        // Try semantic search first, fall back to full-text
        let response: NoteDTO[]
        try {
          const semanticResponse = await fetch('/api/notes/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: debouncedQuery, limit: 20 }),
          })
          
          if (semanticResponse.ok) {
            const data = await semanticResponse.json()
            response = data.results
          } else {
            // Fallback to full-text search
            response = await apiGet<NoteDTO[]>("/api/notes/search?q=" + encodeURIComponent(debouncedQuery))
          }
        } catch (err) {
          // Fallback to full-text search
          response = await apiGet<NoteDTO[]>("/api/notes/search?q=" + encodeURIComponent(debouncedQuery))
        }
        
        // Convert NoteDTO to StreamDrop format
        const streamDrops: StreamDrop[] = response.map((drop) => ({
          id: drop.id,
          type: (drop.dropType as StreamDrop["type"]) || "text",
          content: drop.content,
          timestamp: new Date(drop.createdAt),
          tags: drop.tags.map((label) => ({ label })),
          fileName: drop.fileName || undefined,
          fileType: drop.fileType || undefined,
          fileUrl: drop.fileUrl || undefined,
        }))
        
        if (canceled) return
        setResults(streamDrops)
      } catch (err) {
        console.error("[Search] Error:", err)
        if (canceled) return
        setError("Failed to search. Please try again.")
        setResults([])
      } finally {
        if (canceled) return
        setIsSearching(false)
      }
    }

    performSearch()

    return () => {
      canceled = true
    }
  }, [debouncedQuery])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl h-[80vh] p-0 flex flex-col">
        {/* Search Input */}
        <div className="p-6 border-b">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search notes, files, and tags..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 text-lg"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-4">
            {isSearching ? (
              <div className="text-center py-16">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Searching...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-destructive text-lg mb-2">{error}</p>
              </div>
            ) : query.trim() === "" ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-2">
                  Start typing to search
                </p>
                <p className="text-muted-foreground text-sm">
                  Search across all your notes, files, and tags
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-2">
                  No results found
                </p>
                <p className="text-muted-foreground text-sm">
                  Try different keywords or check your spelling
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Found {results.length} result{results.length !== 1 ? "s" : ""}
                </p>
                {results.map((drop) => (
                  <StreamMessage key={drop.id} drop={drop} isUser={false} />
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
