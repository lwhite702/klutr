"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MobileNavSheet } from "./MobileNavSheet"
import { isDemoMode } from "@/lib/onboarding"
import { apiPost } from "@/lib/clientApi"
import { Loader2 } from "lucide-react"
import { HelpCenterLauncher } from "@/components/help/HelpCenter"
import { Hint } from "@/components/ui/hint"

export function TopBar({ showDemoBadge = false }: { showDemoBadge?: boolean }) {
  const [demoMode, setDemoMode] = useState(false)
  const [isReclustering, setIsReclustering] = useState(false)

  useEffect(() => {
    setDemoMode(isDemoMode())
  }, [])

  const handleRecluster = async () => {
    if (demoMode) {
      console.log("[v0] Demo mode: pretend recluster")
      return
    }

    setIsReclustering(true)
    try {
      await apiPost("/api/mindstorm/recluster")
      console.log("[v0] Reclustering complete")
      // Optionally show a success toast here
    } catch (error) {
      console.error("[v0] Failed to recluster:", error)
    } finally {
      setIsReclustering(false)
    }
  }

  const handleProfile = () => {
    console.log("[v0] Profile clicked")
  }

  const handleSignOut = () => {
    console.log("[v0] Sign out clicked")
  }

  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="flex items-center gap-4 p-4">
        <MobileNavSheet />

        <div className="flex-1 max-w-md">
          <Input placeholder="Search your notes..." className="w-full" />
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {(demoMode || showDemoBadge) && (
            <Badge variant="secondary" className="hidden sm:flex">
              demo
            </Badge>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleRecluster}
              disabled={isReclustering}
              className="border-[var(--color-indigo)] text-[var(--color-indigo)] hover:bg-[var(--color-indigo)] hover:text-white"
            >
              {isReclustering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Re-clustering...
                </>
              ) : (
                "Re-cluster now"
              )}
            </Button>
            <Hint
              title="What re-cluster does"
              message="We re-embed every note, re-score similarity, then shuffle stacks so MindStorm stays sharp."
            />
          </div>

          <HelpCenterLauncher />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleProfile}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
