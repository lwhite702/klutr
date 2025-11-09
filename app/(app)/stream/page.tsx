"use client";

import { useState, useEffect, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { StreamInput } from "@/components/stream/StreamInput";
import { StreamMessage } from "@/components/stream/StreamMessage";
import { DropZone } from "@/components/stream/DropZone";
import { AutoSummary } from "@/components/stream/AutoSummary";
import { VoiceRecorder } from "@/components/stream/VoiceRecorder";
import { StreamErrorBoundary } from "@/components/stream/StreamErrorBoundary";
import { StreamSkeleton } from "@/components/stream/StreamSkeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { apiPost, apiGet } from "@/lib/clientApi";
import { uploadFile } from "@/lib/storage/upload";
import { classifyDrop } from "@/lib/ai/classifyDrop";
import { useKeyboardShortcuts } from "@/lib/hooks/useKeyboardShortcuts";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import type { StreamDrop } from "@/lib/mockData";
import type { NoteDTO } from "@/lib/dto";

interface StreamDropsResponse {
  drops: NoteDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
}

export default function StreamPage() {
  const [drops, setDrops] = useState<StreamDrop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, loading: userLoading } = useCurrentUser();

  // Load drops on mount
  useEffect(() => {
    loadDrops();
  }, []);

  // Auto-scroll to bottom when new drops are added
  useEffect(() => {
    if (scrollRef.current && drops.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [drops]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: "k",
      meta: true,
      handler: () => {
        router.push("/app/search");
      },
      description: "Open search",
    },
    {
      key: "n",
      meta: true,
      handler: () => {
        // Focus input (would need ref to StreamInput)
        document.querySelector("textarea")?.focus();
      },
      description: "New drop",
    },
  ]);

  const loadDrops = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiGet<StreamDropsResponse>("/api/stream/list");
      if (response.drops) {
        // Convert NoteDTO to StreamDrop format
        const streamDrops: StreamDrop[] = response.drops.map((drop) => ({
          id: drop.id,
          type: (drop.dropType as StreamDrop["type"]) || "text",
          content: drop.content,
          timestamp: new Date(drop.createdAt),
          tags: drop.tags.map((label) => ({ label })),
          fileName: drop.fileName || undefined,
          fileType: drop.fileType || undefined,
          fileUrl: drop.fileUrl || undefined,
        }));
        setDrops(streamDrops);
      }
    } catch (err) {
      console.error("[v0] Load drops error:", err);
      setError("Failed to load stream. Please try again.");
      setDrops([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (content: string) => {
    try {
      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const optimisticDrop: StreamDrop = {
        id: tempId,
        type: "text",
        content,
        timestamp: new Date(),
        tags: [],
      };

      setDrops((prev) => [...prev, optimisticDrop]);

      // Create drop via API
      const response = await apiPost<NoteDTO>("/api/stream/create", {
        content,
        dropType: "text",
        type: "misc",
      });

      // Replace optimistic drop with real one
      const realDrop: StreamDrop = {
        id: response.id,
        type: (response.dropType as StreamDrop["type"]) || "text",
        content: response.content,
        timestamp: new Date(response.createdAt),
        tags: response.tags.map((label) => ({ label })),
      };

      setDrops((prev) =>
        prev.map((drop) => (drop.id === tempId ? realDrop : drop))
      );

      toast.success("Drop added to stream");
    } catch (err) {
      console.error("[v0] Send error:", err);
      toast.error("Failed to add drop. Please try again.");
      // Remove optimistic drop on error
      setDrops((prev) => prev.filter((drop) => !drop.id.startsWith("temp-")));
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (userLoading || !user) {
      toast.error("Please wait for authentication to complete");
      return;
    }

    try {
      for (const file of files) {
        // Upload file first
        const uploadResult = await uploadFile(file, user.id);
        
        const dropType = await classifyDrop("", file.type);

        // Create drop with file URL
        const response = await apiPost<NoteDTO>("/api/stream/create", {
          content: file.name,
          dropType,
          fileUrl: uploadResult.fileUrl,
          fileName: uploadResult.fileName,
          fileType: uploadResult.fileType,
          type: "misc",
        });

        const newDrop: StreamDrop = {
          id: response.id,
          type: dropType,
          content: response.content,
          timestamp: new Date(response.createdAt),
          tags: response.tags.map((label) => ({ label })),
          fileName: response.fileName || undefined,
          fileType: response.fileType || undefined,
          fileUrl: response.fileUrl || undefined,
        };

        setDrops((prev) => [...prev, newDrop]);
      }
      toast.success(`${files.length} file(s) uploaded`);
    } catch (err) {
      console.error("[v0] File upload error:", err);
      toast.error("Failed to upload file. Please try again.");
    }
  };

  const handleVoiceRecord = async (audioBlob: Blob, duration: number) => {
    if (userLoading || !user) {
      toast.error("Please wait for authentication to complete");
      throw new Error("User not authenticated");
    }

    try {
      // Convert blob to File for upload
      const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, {
        type: "audio/webm",
      });

      // Upload audio file
      const uploadResult = await uploadFile(audioFile, user.id);

      // Create drop with audio URL
      const response = await apiPost<NoteDTO>("/api/stream/create", {
        content: `Voice note (${Math.floor(duration)}s)`,
        dropType: "voice",
        fileUrl: uploadResult.fileUrl,
        fileName: uploadResult.fileName,
        fileType: uploadResult.fileType,
        type: "voice",
      });

      const newDrop: StreamDrop = {
        id: response.id,
        type: "voice",
        content: response.content,
        timestamp: new Date(response.createdAt),
        tags: response.tags.map((label) => ({ label })),
        fileName: response.fileName || undefined,
        fileType: response.fileType || undefined,
        fileUrl: response.fileUrl || undefined,
      };

      setDrops((prev) => [...prev, newDrop]);
      toast.success("Voice note added to stream");
    } catch (err) {
      console.error("[v0] Voice upload error:", err);
      toast.error("Failed to save voice note. Please try again.");
      throw err;
    }
  };

  return (
    <AppShell activeRoute="/app/stream">
      <StreamErrorBoundary>
        <DropZone onDrop={handleFileUpload}>
        <div className="flex h-[calc(100vh-64px)]">
          {/* Center - Stream */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 px-4" ref={scrollRef}>
              <div className="max-w-4xl mx-auto py-8">
                {isLoading ? (
                  <StreamSkeleton />
                ) : error ? (
                  <div className="text-center py-16">
                    <p className="text-destructive text-lg mb-2">{error}</p>
                    <button
                      onClick={loadDrops}
                      className="text-sm text-muted-foreground hover:text-foreground underline"
                    >
                      Retry
                    </button>
                  </div>
                ) : drops.length === 0 ? (
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
            <div className="p-4 border-t">
              <div className="max-w-4xl mx-auto mb-2">
                <VoiceRecorder
                  onRecordingComplete={handleVoiceRecord}
                  onError={(err) => toast.error(err)}
                />
              </div>
              <StreamInput
                onSend={handleSend}
                onFileUpload={handleFileUpload}
              />
            </div>
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
      </StreamErrorBoundary>
    </AppShell>
  );
}
