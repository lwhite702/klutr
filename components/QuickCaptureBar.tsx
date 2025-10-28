"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

type QuickCaptureBarProps = {
  onSubmit?: (text: string) => void
}

export function QuickCaptureBar({ onSubmit }: QuickCaptureBarProps) {
  const [text, setText] = useState("")

  const handleSave = () => {
    if (!text.trim()) return
    onSubmit?.(text)
    setText("")
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
        placeholder="Add a thought, link, or note..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-[100px] resize-none"
      />
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={!text.trim()}>Save</Button>
      </div>
      <p className="text-xs text-muted-foreground">Tip: Press Cmd/Ctrl + Enter to save quickly</p>
    </Card>
  )
}
