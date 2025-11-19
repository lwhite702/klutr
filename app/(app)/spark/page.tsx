"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useSpark } from "@/lib/hooks/useSpark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SparkPage() {
  const [noteId, setNoteId] = useState("");
  const [prompt, setPrompt] = useState("");
  const { runSpark, loading, response, error, clearResponse } = useSpark();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteId || !prompt) return;
    await runSpark(noteId, prompt);
  };

  return (
    <AppShell activeRoute="/app/spark">
      <div className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-display text-accent-coral mb-6">Spark</h1>
        <p className="text-slate-400 font-body mb-8">
          Your contextual AI partner. Analyze and expand on your notes with
          thoughtful insights.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label
              htmlFor="noteId"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Note ID
            </label>
            <Input
              id="noteId"
              type="text"
              placeholder="Enter note ID..."
              value={noteId}
              onChange={(e) => setNoteId(e.target.value)}
              disabled={loading}
              className="w-full"
            />
          </div>

          <div>
            <label
              htmlFor="prompt"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Ask Spark
            </label>
            <Input
              id="prompt"
              type="text"
              placeholder="What would you like to explore about this note?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={loading || !noteId || !prompt}
              className="bg-accent-coral hover:bg-accent-coral/90 text-white"
            >
              {loading ? "Thinking..." : "Run Spark"}
            </Button>
            {(response || error) && (
              <Button
                type="button"
                variant="outline"
                onClick={clearResponse}
                disabled={loading}
              >
                Clear
              </Button>
            )}
          </div>
        </form>

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {response && (
          <div className="mt-6 p-6 bg-slate-900/50 border border-slate-700 rounded-lg">
            <h2 className="text-lg font-display text-accent-coral mb-3">
              Response
            </h2>
            <div className="text-slate-300 font-body whitespace-pre-line leading-relaxed">
              {response}
              {loading && (
                <span className="inline-block w-2 h-4 bg-accent-coral ml-1 animate-pulse" />
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
