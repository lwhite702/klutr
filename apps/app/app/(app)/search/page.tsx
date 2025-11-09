"use client";

import { useState, useMemo, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/input";
import { StreamMessage } from "@/components/stream/StreamMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { apiGet } from "@/lib/clientApi";
import { toast } from "sonner";
import type { StreamDrop } from "@/lib/mockData";
import type { NoteDTO } from "@/lib/dto";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<StreamDrop[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      try {
        setIsSearching(true);
        setError(null);
        const response = await apiGet<NoteDTO[]>("/api/stream/search?q=" + encodeURIComponent(debouncedQuery));
        
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
        }));
        
        setResults(streamDrops);
      } catch (err) {
        console.error("[v0] Search error:", err);
        setError("Failed to search. Please try again.");
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  return (
    <AppShell activeRoute="/app/search">
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader
          title="Search"
          description="Find notes, files, and ideas across your stream"
        />
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search your stream..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <ScrollArea className="h-[calc(100vh-250px)]">
          <div className="space-y-4 px-4">
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
      </div>
    </AppShell>
  );
}
