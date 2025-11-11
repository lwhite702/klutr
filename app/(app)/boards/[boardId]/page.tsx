"use client";

import { use } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StreamMessage } from "@/components/stream/StreamMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockBoards, mockStreamDrops, type StreamDrop } from "@/lib/mockData";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BoardDetailPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = use(params);
  const router = useRouter();
  const board = mockBoards.find((b) => b.id === boardId);

  if (!board) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
          <PageHeader title="Board not found" />
          <Button onClick={() => router.push("/app/boards")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Boards
          </Button>
      </div>
    );
  }

  // Filter drops by board tags (simplified - in real app would use proper filtering)
  const boardTags = board.tags.map((t) => t.label);
  const filteredDrops: StreamDrop[] = mockStreamDrops.filter((drop) =>
    drop.tags.some((tag) => boardTags.includes(tag.label))
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader
          title={board.name}
          description={board.description}
          actions={
            <Button
              variant="outline"
              onClick={() => router.push("/app/boards")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          }
        />
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4 px-4">
            {filteredDrops.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-2">
                  No notes in this board yet
                </p>
                <p className="text-muted-foreground text-sm">
                  Notes matching this board's tags will appear here
                </p>
              </div>
            ) : (
              filteredDrops.map((drop) => (
                <StreamMessage key={drop.id} drop={drop} isUser={false} />
              ))
            )}
          </div>
        </ScrollArea>
    </div>
  );
}

