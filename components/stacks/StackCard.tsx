"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pin, PinOff } from "lucide-react"
import { apiPost } from "@/lib/clientApi"
import { isDemoMode } from "@/lib/onboarding"

interface StackCardProps {
  name: string
  noteCount: number
  summary: string
  pinned?: boolean
}

export function StackCard({ name, noteCount, summary, pinned = false }: StackCardProps) {
  const router = useRouter()
  const [isPinned, setIsPinned] = useState(pinned)
  const [isUpdating, setIsUpdating] = useState(false)
  const demoMode = isDemoMode()

  const handleOpen = () => {
    router.push(`/app/stacks/${encodeURIComponent(name)}`)
  }

  const handlePin = async () => {
    if (demoMode) {
      setIsPinned(!isPinned)
      console.log("[v0] Demo mode: toggle pin for", name)
      return
    }

    setIsUpdating(true)
    try {
      await apiPost("/api/stacks/pin", { name, pinned: !isPinned })
      setIsPinned(!isPinned)
    } catch (error) {
      console.error("[v0] Failed to pin stack:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = () => {
    console.log("[v0] Delete Stack clicked:", name)
    // TODO: Implement delete functionality
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{name}</CardTitle>
          <Badge variant="secondary">{noteCount} notes</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleOpen}>
            Open Stack
          </Button>
          <Button size="sm" variant="outline" onClick={handlePin} disabled={isUpdating}>
            {isPinned ? (
              <>
                <PinOff className="mr-1 h-3 w-3" />
                Unpin
              </>
            ) : (
              <>
                <Pin className="mr-1 h-3 w-3" />
                Pin
              </>
            )}
          </Button>
          <Button size="sm" variant="outline" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
