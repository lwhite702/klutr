"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { ThreadList } from "./ThreadList";
import type { ConversationThreadDTO } from "@/lib/dto";

interface ThreadDrawerProps {
  threads: ConversationThreadDTO[];
  selectedThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  isLoading: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ThreadDrawer({
  threads,
  selectedThreadId,
  onSelectThread,
  isLoading,
  open,
  onOpenChange,
}: ThreadDrawerProps) {
  const handleSelectThread = (threadId: string) => {
    onSelectThread(threadId);
    onOpenChange(false); // Close drawer after selection
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => onOpenChange(true)}
        aria-label="Open threads"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Threads</SheetTitle>
          </SheetHeader>
          <ThreadList
            threads={threads}
            selectedThreadId={selectedThreadId}
            onSelectThread={handleSelectThread}
            isLoading={isLoading}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
