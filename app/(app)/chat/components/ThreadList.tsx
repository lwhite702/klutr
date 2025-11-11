"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ConversationThreadDTO } from "@/lib/dto";

interface ThreadListProps {
  threads: ConversationThreadDTO[];
  selectedThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  isLoading: boolean;
}

export function ThreadList({
  threads,
  selectedThreadId,
  onSelectThread,
  isLoading,
}: ThreadListProps) {
  if (isLoading) {
    return (
      <div className="p-4">
        <p className="text-sm text-muted-foreground">Loading threads...</p>
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="p-4">
        <p className="text-sm text-muted-foreground">No threads yet</p>
        <p className="text-xs text-muted-foreground mt-2">
          Start a conversation to create your first thread
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-2 space-y-2">
        {threads.map((thread) => (
          <Card
            key={thread.id}
            className={cn(
              "p-3 cursor-pointer hover:bg-muted/50 transition-colors",
              selectedThreadId === thread.id && "bg-muted border-[#FF7F73]"
            )}
            onClick={() => onSelectThread(thread.id)}
          >
            <div className="space-y-2">
              <h3 className="font-medium text-sm line-clamp-1">
                {thread.title || "Untitled thread"}
              </h3>
              {thread.system_tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {thread.system_tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs bg-[#A7F1D1]/20 text-[#A7F1D1]"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{thread.messageCount || 0} messages</span>
                <span>
                  {new Date(thread.createdAt).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

