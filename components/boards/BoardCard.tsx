"use client";

import { motion } from "framer-motion";
import { Pin, PinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { TagChips } from "@/components/stream/TagChips";
import type { BoardDTO } from "@/lib/dto";

interface BoardCardProps {
  board: BoardDTO;
  onPin?: (boardId: string) => void;
  onClick?: (boardId: string) => void;
}

export function BoardCard({ board, onPin, onClick }: BoardCardProps) {
  const timeAgo = formatDistanceToNow(new Date(board.updatedAt), {
    addSuffix: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="p-4 rounded-lg border bg-card cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => onClick?.(board.id)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">{board.name}</h3>
            {board.pinned && <Pin className="h-4 w-4 text-muted-foreground" />}
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {board.description}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            onPin?.(board.id);
          }}
          aria-label={board.pinned ? "Unpin board" : "Pin board"}
        >
          {board.pinned ? (
            <PinOff className="h-4 w-4" />
          ) : (
            <Pin className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="flex items-center justify-between mt-3">
        <TagChips tags={board.tags.map((label) => ({ label }))} />
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{board.noteCount} notes</span>
          <span>•</span>
          <span>{timeAgo}</span>
        </div>
      </div>
    </motion.div>
  );
}
