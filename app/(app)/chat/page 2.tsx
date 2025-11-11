"use client";

import { FeatureGate } from "@/components/ui/FeatureGate";
import { ChatView } from "./components/ChatView";

export default function ChatPage() {
  return (
    <FeatureGate flag="chat-interface" fallback={
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Chat interface is not available yet.</p>
      </div>
    }>
      <ChatView />
    </FeatureGate>
  );
}

