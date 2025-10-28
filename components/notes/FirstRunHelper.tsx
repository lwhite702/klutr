"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2 } from "lucide-react"
import confetti from "canvas-confetti"

interface FirstRunHelperProps {
  onCreateExample: () => Promise<void>
}

export function FirstRunHelper({ onCreateExample }: FirstRunHelperProps) {
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateExample = async () => {
    setIsCreating(true)
    try {
      await onCreateExample()
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Card className="p-8 text-center space-y-4 border-2 border-dashed">
      <div className="flex justify-center">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Let's get something out of your head.</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Type anything — a task, a half-thought, a phone number. We'll organize it.
        </p>
      </div>
      <Button size="lg" onClick={handleCreateExample} disabled={isCreating}>
        {isCreating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Create example note for me
          </>
        )}
      </Button>
    </Card>
  )
}
