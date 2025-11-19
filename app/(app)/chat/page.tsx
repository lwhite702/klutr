import { AppShell } from "@/components/layout/AppShell";
import { ChatPageClient } from "./ChatPageClient";

export default function ChatPage() {
  return (
    <AppShell activeRoute="/app/chat">
      <ChatPageClient />
    </AppShell>
  );
}
