"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Loader2 } from "lucide-react"

interface QuickCaptureBarProps {
  onSubmit?: (text: string) => void
}

export function QuickCaptureBar({ onSubmit }: QuickCaptureBarProps) {
  const [content, setContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (content.trim()) {
      setIsSaving(true)
      if (onSubmit) {
        onSubmit(content)
      }
      setContent("")
      // Simulate async operation
      setTimeout(() => {
        setIsSaving(false)
      }, 1000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <Card className="p-4 space-y-3">
      <Textarea
        placeholder="Dump a thought, link, phone number, half idea..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-[100px] resize-none"
        disabled={isSaving}
      />
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={!content.trim() || isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" disabled className="opacity-50 bg-transparent">
                AI classify
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">We'll auto-tag this note and sort it into a stack when you save.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="text-xs text-muted-foreground">Tip: Press Cmd/Ctrl + Enter to save quickly</p>
    </Card>
  )
}
