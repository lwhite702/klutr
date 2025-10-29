"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/notes/NoteCard";
import type { NoteDTO } from "@/types/note";
import { apiGet } from "@/lib/clientApi";
import { isDemoMode } from "@/lib/onboarding";
import { ArrowLeft } from "lucide-react";

export default function StackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const stackName = decodeURIComponent(params.stack as string);
  const [notes, setNotes] = useState<NoteDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const demoMode = isDemoMode();

  useEffect(() => {
    async function loadStackNotes() {
      if (demoMode) {
        // Mock notes for demo
        setNotes([
          {
            id: "1",
            content: "Example note in this stack",
            type: "idea",
            archived: false,
            createdAt: new Date().toISOString(),
            tags: ["example"],
            cluster: stackName,
            clusterConfidence: 0.9,
            clusterUpdatedAt: new Date().toISOString(),
          },
        ]);
        setIsLoading(false);
        return;
      }

      try {
        const data = await apiGet<NoteDTO[]>(
          `/api/stacks/detail?cluster=${encodeURIComponent(stackName)}`
        );
        setNotes(data);
      } catch (error) {
        console.error("[v0] Failed to load stack notes:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStackNotes();
  }, [stackName, demoMode]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-24 bg-muted rounded" />
          <div className="h-24 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <AppShell activeRoute="/app/stacks">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {stackName}
            </h1>
            <p className="text-muted-foreground">
              {notes.length} notes in this stack
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {notes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <NoteCard note={note} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {notes.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No notes in this stack yet.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
