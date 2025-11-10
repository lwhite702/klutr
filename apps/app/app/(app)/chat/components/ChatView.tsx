"use client";

import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropComposer } from "./DropComposer";
import { MessageBubble } from "./MessageBubble";
import { ThreadList } from "./ThreadList";
import { ThreadDrawer } from "./ThreadDrawer";
import { InsightStrip } from "./InsightStrip";
import { apiPost, apiGet } from "@/lib/clientApi";
import { toast } from "sonner";
import type { MessageDTO, ConversationThreadDTO } from "@/lib/dto";

interface MessagesResponse {
  messages: MessageDTO[];
  thread: ConversationThreadDTO;
}

export function ChatView() {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [threads, setThreads] = useState<ConversationThreadDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [threadDrawerOpen, setThreadDrawerOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadThreads();
  }, []);

  useEffect(() => {
    if (selectedThreadId) {
      loadMessages(selectedThreadId);
    }
  }, [selectedThreadId]);

  useEffect(() => {
    if (scrollRef.current && messages.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadThreads = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement /api/messages/threads endpoint
      // const response = await apiGet<{ threads: ConversationThreadDTO[] }>("/api/messages/threads");
      // setThreads(response.threads || []);
      setThreads([]);
    } catch (err) {
      console.error("[chat] Load threads error:", err);
      toast.error("Failed to load threads");
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (threadId: string) => {
    try {
      // TODO: Implement /api/messages/list endpoint
      // const response = await apiGet<MessagesResponse>(`/api/messages/list?threadId=${threadId}`);
      // setMessages(response.messages || []);
      setMessages([]);
    } catch (err) {
      console.error("[chat] Load messages error:", err);
      toast.error("Failed to load messages");
    }
  };

  const handleSendMessage = async (type: "text" | "audio" | "image" | "file" | "link", content?: string, fileUrl?: string, url?: string) => {
    try {
      const response = await apiPost<MessageDTO & { thread: ConversationThreadDTO }>("/api/messages/create", {
        type,
        content,
        fileUrl,
        url,
        threadId: selectedThreadId || undefined,
      });

      // Add message to current thread
      setMessages((prev) => [...prev, response]);

      // Update threads list if new thread created
      if (!selectedThreadId && response.thread) {
        setThreads((prev) => [response.thread, ...prev]);
        setSelectedThreadId(response.threadId);
      }

      toast.success("Message sent");
    } catch (err) {
      console.error("[chat] Send message error:", err);
      toast.error("Failed to send message");
    }
  };

  return (
    <>
      {/* Mobile Thread Drawer */}
      <div className="lg:hidden fixed top-20 left-4 z-20">
        <ThreadDrawer
          threads={threads}
          selectedThreadId={selectedThreadId}
          onSelectThread={setSelectedThreadId}
          isLoading={isLoading}
          open={threadDrawerOpen}
          onOpenChange={setThreadDrawerOpen}
        />
      </div>

      <div className="flex h-[calc(100vh-64px)] -m-6 md:-m-8">
        {/* Left Sidebar - Thread List (Desktop only) */}
        <aside className="hidden lg:block w-64 border-r bg-muted/30">
          <ThreadList
            threads={threads}
            selectedThreadId={selectedThreadId}
            onSelectThread={setSelectedThreadId}
            isLoading={isLoading}
          />
        </aside>

        {/* Center - Chat Messages */}
        <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="max-w-4xl mx-auto py-8">
            {messages.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-2">
                  {selectedThreadId ? "No messages yet" : "Select a thread or start a new conversation"}
                </p>
                <p className="text-muted-foreground text-sm">
                  Type a message below to get started
                </p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </>
            )}
          </div>
        </ScrollArea>

        {/* Bottom - Input */}
        <div className="p-4 border-t">
          <div className="max-w-4xl mx-auto">
            <DropComposer onSend={handleSendMessage} />
          </div>
        </div>
      </div>

        {/* Right Sidebar - AI Insights */}
        <aside className="hidden xl:block w-64 border-l bg-muted/30">
          <InsightStrip threadId={selectedThreadId} />
        </aside>
      </div>
    </>
  );
}

