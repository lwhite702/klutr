"use client";

import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { FileText, Image as ImageIcon, Mic, File } from "lucide-react";
import { brandColors } from "@/lib/brand";
import { TagChips } from "./TagChips";
import type { StreamDrop } from "@/lib/mockData";

interface StreamMessageProps {
  drop: StreamDrop;
  isUser?: boolean;
}

export function StreamMessage({ drop, isUser = false }: StreamMessageProps) {
  const timeAgo = formatDistanceToNow(drop.timestamp, { addSuffix: true });

  const getIcon = () => {
    switch (drop.type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      case "file":
        return <FileText className="h-4 w-4" />;
      case "voice":
        return <Mic className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getFilePreview = () => {
    if (drop.type === "image" && drop.fileUrl) {
      return (
        <div className="mt-2 rounded-lg overflow-hidden">
          <img
            src={drop.fileUrl}
            alt={drop.content}
            className="max-w-full h-auto max-h-64 object-cover"
          />
        </div>
      );
    }
    if ((drop.type === "file" || drop.type === "voice") && drop.fileName) {
      return (
        <div className="mt-2 flex items-center gap-2 p-2 rounded bg-muted/50">
          {getIcon()}
          <span className="text-sm text-muted-foreground">{drop.fileName}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full"
    >
      {/* Fintask-inspired card styling */}
      <div
        className={`
          rounded-lg border bg-card shadow-sm
          px-4 py-3
          transition-shadow hover:shadow-md
          ${isUser ? "border-[var(--klutr-coral)]/30" : "border-border"}
        `}
        style={isUser ? { borderColor: `${brandColors.coral}30` } : undefined}
      >
        <div className="flex items-start gap-3">
          {!isUser && getIcon() && (
            <div className="mt-0.5 flex-shrink-0">{getIcon()}</div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
              {drop.content}
            </p>
            {getFilePreview()}
            <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
              <TagChips tags={drop.tags} />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {timeAgo}
              </span>
            </div>
          </div>
          {isUser && getIcon() && (
            <div className="mt-0.5 flex-shrink-0">{getIcon()}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

