"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Hint } from "@/components/ui/hint"

interface QuickCaptureBarProps {
  onCreate: (content: string) => Promise<void>
  isCreating?: boolean
}

export function QuickCaptureBar({ onCreate, isCreating = false }: QuickCaptureBarProps) {
  const [content, setContent] = useState("")

  const handleSave = async () => {
    if (content.trim()) {
      await onCreate(content)
      setContent("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <Card className="space-y-4 rounded-[var(--radius-card)] border border-[var(--color-indigo)]/20 p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-indigo)]">Quick capture</p>
          <p className="text-xs text-muted-foreground">Drop it in now, the AI will sort the rest.</p>
        </div>
        <Hint
          title="Capture anything"
          message="Text, links, files ? toss them here. Klutr snapshots the context so auto-tagging and stacks stay clever."
        />
      </div>

      <Textarea
        placeholder="Dump a thought, link, phone number, half idea..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-[100px] resize-none"
        disabled={isCreating}
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={handleSave}
          disabled={!content.trim() || isCreating}
          className="bg-[var(--color-indigo)] text-white shadow hover:opacity-90"
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
        <Button variant="outline" disabled className="bg-transparent opacity-60">
          AI classify
        </Button>
        <Hint
          title="Auto tagging"
          message="On save we embed the note, tag it, and queue stack updates. That button lights up once the live classifier ships."
        />
      </div>
      <p className="text-xs text-muted-foreground">Tip: Press Cmd/Ctrl + Enter to save quickly</p>
    </Card>
  )
}
