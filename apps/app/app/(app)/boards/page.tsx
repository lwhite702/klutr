"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { BoardCard } from "@/components/boards/BoardCard";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost, apiPatch } from "@/lib/clientApi";
import { toast } from "sonner";
import type { BoardDTO } from "@/lib/dto";
import type { Board } from "@/lib/mockData";

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiGet<BoardDTO[]>("/api/boards/list");
      
      // Convert BoardDTO to Board format
      const boardsData: Board[] = response.map((board) => ({
        id: board.id,
        name: board.name,
        description: board.description || "",
        tags: board.tags.map((label) => ({ label })),
        noteCount: board.noteCount,
        pinned: board.pinned,
        lastActivity: new Date(board.updatedAt),
      }));
      
      setBoards(boardsData);
    } catch (err) {
      console.error("[v0] Load boards error:", err);
      setError("Failed to load boards. Please try again.");
      setBoards([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePin = async (boardId: string) => {
    try {
      const board = boards.find((b) => b.id === boardId);
      if (!board) return;

      // Optimistic update
      setBoards((prev) =>
        prev.map((b) =>
          b.id === boardId ? { ...b, pinned: !b.pinned } : b
        )
      );

      // Update via API
      await apiPatch<BoardDTO>(`/api/boards/${boardId}`, {
        pinned: !board.pinned,
      });
    } catch (err) {
      console.error("[v0] Pin error:", err);
      toast.error("Failed to update board");
      // Revert on error
      loadBoards();
    }
  };

  const handleClick = (boardId: string) => {
    router.push(`/app/boards/${boardId}`);
  };

  const handleCreate = async () => {
    try {
      const name = prompt("Enter board name:");
      if (!name || !name.trim()) return;

      const response = await apiPost<BoardDTO>("/api/boards/create", {
        name: name.trim(),
        description: "",
        pinned: false,
      });

      const newBoard: Board = {
        id: response.id,
        name: response.name,
        description: response.description || "",
        tags: response.tags.map((label) => ({ label })),
        noteCount: response.noteCount,
        pinned: response.pinned,
        lastActivity: new Date(response.updatedAt),
      };

      setBoards((prev) => [...prev, newBoard]);
      toast.success("Board created");
    } catch (err) {
      console.error("[v0] Create board error:", err);
      toast.error("Failed to create board");
    }
  };

  // Sort: pinned first, then by last activity
  const sortedBoards = [...boards].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.lastActivity.getTime() - a.lastActivity.getTime();
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader
          title="Boards"
          description="Auto-organized collections of related notes"
          actions={
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Create Board
            </Button>
          }
        />
        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading boards...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-destructive text-lg mb-2">{error}</p>
            <Button onClick={loadBoards} variant="outline">
              Retry
            </Button>
          </div>
        ) : (
          <>
            <CardGrid>
              {sortedBoards.map((board) => (
                <BoardCard
                  key={board.id}
                  board={board}
                  onPin={handlePin}
                  onClick={handleClick}
                />
              ))}
            </CardGrid>
            {boards.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-2">
                  No boards yet
                </p>
                <p className="text-muted-foreground text-sm mb-4">
                  Boards are automatically created as you add notes to your stream
                </p>
                <Button onClick={handleCreate}>Create your first board</Button>
              </div>
            )}
          </>
        )}
    </div>
  );
}
