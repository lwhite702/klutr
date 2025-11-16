"use client";

import { use, useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StreamMessage } from "@/components/stream/StreamMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/clientApi";
import { toast } from "sonner";
import type { BoardDTO } from "@/lib/dto";
import type { NoteDTO } from "@/lib/dto";
import type { StreamDrop } from "@/lib/types/stream";

export default function BoardDetailPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = use(params);
  const router = useRouter();
  const [board, setBoard] = useState<BoardDTO | null>(null);
  const [drops, setDrops] = useState<StreamDrop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBoard();
  }, [boardId]);

  const loadBoard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const boardData = await apiGet<BoardDTO & { notes?: NoteDTO[] }>(
        `/api/boards/${boardId}`
      );
      setBoard(boardData);

      // Convert board notes to StreamDrop format
      const notes: NoteDTO[] = boardData.notes || [];
      const streamDrops: StreamDrop[] = notes.map((note) => ({
        id: note.id,
        type: (note.dropType as StreamDrop["type"]) || "text",
        content: note.content,
        timestamp: new Date(note.createdAt),
        tags: note.tags.map((label) => ({ label })),
        fileName: note.fileName || undefined,
        fileType: note.fileType || undefined,
        fileUrl: note.fileUrl || undefined,
      }));

      setDrops(streamDrops);
    } catch (err) {
      console.error("[v0] Load board error:", err);
      setError("Failed to load board. Please try again.");
      toast.error("Failed to load board");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader title="Loading..." />
        <div className="text-center py-16">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading board...</p>
        </div>
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader title={error || "Board not found"} />
        <Button onClick={() => router.push("/app/boards")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Boards
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title={board.name}
        description={board.description || undefined}
        actions={
          <Button variant="outline" onClick={() => router.push("/app/boards")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        }
      />
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4 px-4">
          {drops.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-2">
                No notes in this board yet
              </p>
              <p className="text-muted-foreground text-sm">
                Notes added to this board will appear here
              </p>
            </div>
          ) : (
            drops.map((drop) => (
              <StreamMessage key={drop.id} drop={drop} isUser={false} />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
