"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Loader2 } from "lucide-react"

interface TopBarProps {
  showDemoBadge?: boolean
}

export function TopBar({ showDemoBadge = false }: TopBarProps) {
  const [isReclustering, setIsReclustering] = useState(false)

  const handleRecluster = () => {
    console.log("Re-cluster now clicked")
    setIsReclustering(true)
    // Simulate async operation
    setTimeout(() => {
      setIsReclustering(false)
    }, 2000)
  }

  const handleProfile = () => {
    console.log("Profile clicked")
  }

  const handleSignOut = () => {
    console.log("Sign out clicked")
  }

  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="flex items-center gap-4 p-4">
        <div className="flex-1 max-w-md">
          <Input placeholder="Search your notes..." className="w-full" />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {showDemoBadge && (
            <Badge variant="secondary" className="hidden sm:flex">
              Demo
            </Badge>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={handleRecluster} disabled={isReclustering}>
                  {isReclustering ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Re-clustering...
                    </>
                  ) : (
                    "Re-cluster now"
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  We embed your notes with AI, compare them in vector space, and group related ideas together.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

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
