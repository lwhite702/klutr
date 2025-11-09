"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { BoardCard } from "@/components/boards/BoardCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { mockBoards, type Board } from "@/lib/mockData";
import { useRouter } from "next/navigation";

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>(mockBoards);
  const router = useRouter();

  const handlePin = (boardId: string) => {
    setBoards((prev) =>
      prev.map((board) =>
        board.id === boardId ? { ...board, pinned: !board.pinned } : board
      )
    );
  };

  const handleClick = (boardId: string) => {
    router.push(`/app/boards/${boardId}`);
  };

  const handleCreate = () => {
    // Placeholder for board creation
    console.log("Create board not yet implemented");
  };

  // Sort: pinned first, then by last activity
  const sortedBoards = [...boards].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.lastActivity.getTime() - a.lastActivity.getTime();
  });

  return (
    <AppShell activeRoute="/app/boards">
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
      </div>
    </AppShell>
  );
}

