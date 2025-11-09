"use client";

import { useState, useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/input";
import { StreamMessage } from "@/components/stream/StreamMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search as SearchIcon } from "lucide-react";
import { mockStreamDrops, type StreamDrop } from "@/lib/mockData";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  // Simple fuzzy search implementation
  const filteredDrops = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const queryLower = query.toLowerCase();
    return mockStreamDrops.filter((drop) => {
      // Search in content
      if (drop.content.toLowerCase().includes(queryLower)) {
        return true;
      }
      // Search in tags
      if (drop.tags.some((tag) => tag.label.toLowerCase().includes(queryLower))) {
        return true;
      }
      // Search in filename
      if (drop.fileName?.toLowerCase().includes(queryLower)) {
        return true;
      }
      return false;
    });
  }, [query]);

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
            {query.trim() === "" ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-2">
                  Start typing to search
                </p>
                <p className="text-muted-foreground text-sm">
                  Search across all your notes, files, and tags
                </p>
              </div>
            ) : filteredDrops.length === 0 ? (
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
                  Found {filteredDrops.length} result{filteredDrops.length !== 1 ? "s" : ""}
                </p>
                {filteredDrops.map((drop) => (
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

