"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useMuse } from "@/lib/hooks/useMuse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MusePage() {
  const [ideaA, setIdeaA] = useState("");
  const [ideaB, setIdeaB] = useState("");
  const { runMuse, loading, response, error, clearResponse } = useMuse();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaA || !ideaB) return;
    await runMuse(ideaA, ideaB);
  };

  return (
    <AppShell activeRoute="/app/muse">
      <div className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-display text-[#3ee0c5] mb-6">Muse</h1>
        <p className="text-slate-400 font-body mb-8">
          Your creative remix engine. Combine two ideas into novel insights and
          unexpected connections.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label
              htmlFor="ideaA"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Idea A
            </label>
            <Input
              id="ideaA"
              type="text"
              placeholder="Enter your first idea..."
              value={ideaA}
              onChange={(e) => setIdeaA(e.target.value)}
              disabled={loading}
              className="w-full"
            />
          </div>

          <div>
            <label
              htmlFor="ideaB"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Idea B
            </label>
            <Input
              id="ideaB"
              type="text"
              placeholder="Enter your second idea..."
              value={ideaB}
              onChange={(e) => setIdeaB(e.target.value)}
              disabled={loading}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={loading || !ideaA || !ideaB}
              className="bg-[#3ee0c5] hover:bg-[#3ee0c5]/90 text-charcoal"
            >
              {loading ? "Remixing..." : "Run Muse"}
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
            <h2 className="text-lg font-display text-[#3ee0c5] mb-3">
              Remix
            </h2>
            <div className="text-slate-300 font-body whitespace-pre-line leading-relaxed">
              {response}
              {loading && (
                <span className="inline-block w-2 h-4 bg-[#3ee0c5] ml-1 animate-pulse" />
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
