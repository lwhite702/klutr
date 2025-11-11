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
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-lg ${
          isUser
            ? "rounded-br-sm bg-[var(--klutr-coral)] text-white"
            : "rounded-bl-sm bg-[var(--klutr-mint)]/20 dark:bg-[var(--klutr-mint)]/10 text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]"
        }`}
      >
        <div className="flex items-start gap-2">
          {!isUser && getIcon() && (
            <div className="mt-0.5">{getIcon()}</div>
          )}
          <div className="flex-1">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {drop.content}
            </p>
            {getFilePreview()}
            <div className="mt-2 flex items-center justify-between gap-2">
              <TagChips tags={drop.tags} />
              <span className="text-xs opacity-70 ml-auto whitespace-nowrap">
                {timeAgo}
              </span>
            </div>
          </div>
          {isUser && getIcon() && (
            <div className="mt-0.5">{getIcon()}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

