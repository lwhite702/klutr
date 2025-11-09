"use client";

import { useState, useEffect, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { StreamInput } from "@/components/stream/StreamInput";
import { StreamMessage } from "@/components/stream/StreamMessage";
import { DropZone } from "@/components/stream/DropZone";
import { AutoSummary } from "@/components/stream/AutoSummary";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockStreamDrops, type StreamDrop } from "@/lib/mockData";
import { tagNotes } from "@/lib/ai/tagNotes";
import { classifyDrop } from "@/lib/ai/classifyDrop";

export default function StreamPage() {
  const [drops, setDrops] = useState<StreamDrop[]>(mockStreamDrops);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new drops are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [drops]);

  const handleSend = async (content: string) => {
    // Optimistic update
    const newDrop: StreamDrop = {
      id: `sd-${Date.now()}`,
      type: "text",
      content,
      timestamp: new Date(),
      tags: [],
    };

    // Add optimistically
    setDrops((prev) => [...prev, newDrop]);

    // Tag the note
    const tags = await tagNotes(content);
    newDrop.tags = tags.map((label) => ({ label }));

    // Update with tags
    setDrops((prev) =>
      prev.map((drop) => (drop.id === newDrop.id ? newDrop : drop))
    );
  };

  const handleFileUpload = async (files: File[]) => {
    for (const file of files) {
      const fileType = file.type;
      const dropType = await classifyDrop("", fileType);

      const newDrop: StreamDrop = {
        id: `sd-${Date.now()}-${Math.random()}`,
        type: dropType,
        content: file.name,
        timestamp: new Date(),
        tags: [],
        fileName: file.name,
        fileType: file.type,
        fileUrl: URL.createObjectURL(file),
      };

      // Tag based on filename
      const tags = await tagNotes(file.name);
      newDrop.tags = tags.map((label) => ({ label }));

      setDrops((prev) => [...prev, newDrop]);
    }
  };

  const handleVoiceRecord = () => {
    // Placeholder for voice recording
    console.log("Voice recording not yet implemented");
  };

  return (
    <AppShell activeRoute="/app/stream">
      <DropZone onDrop={handleFileUpload}>
        <div className="flex h-[calc(100vh-64px)]">
          {/* Left Sidebar - Navigation (handled by AppShell) */}
          
          {/* Center - Stream */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 px-4" ref={scrollRef}>
              <div className="max-w-4xl mx-auto py-8">
                {drops.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground text-lg mb-2">
                      Your stream is empty
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Start by adding a note, file, or voice recording
                    </p>
                  </div>
                ) : (
                  <>
                    {drops.map((drop) => (
                      <StreamMessage
                        key={drop.id}
                        drop={drop}
                        isUser={drop.type === "text"}
                      />
                    ))}
                  </>
                )}
              </div>
            </ScrollArea>
            <AutoSummary isAnalyzing={isAnalyzing} />
            <StreamInput
              onSend={handleSend}
              onFileUpload={handleFileUpload}
              onVoiceRecord={handleVoiceRecord}
            />
          </div>

          {/* Right Sidebar - Context/Tags Panel */}
          <aside className="hidden lg:block w-64 border-l bg-muted/30 p-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Active Tags</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(
                  new Set(drops.flatMap((drop) => drop.tags.map((t) => t.label)))
                ).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-full bg-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </DropZone>
    </AppShell>
  );
}

