"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MobileNavSheet } from "@/components/MobileNavSheet"

type TopBarProps = {
  showDemoBadge?: boolean
}

export function TopBar({ showDemoBadge }: TopBarProps) {
  const handleRecluster = () => {
    console.log("Re-cluster now clicked")
  }
  const handleProfileClick = () => {
    console.log("Profile clicked")
  }
  const handleSignOut = () => {
    console.log("Sign out clicked")
  }

  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="flex items-center gap-4 p-4">
        <MobileNavSheet />
        <div className="flex-1 max-w-md">
          <Input placeholder="Search your notes..." className="w-full" />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {showDemoBadge && (
            <Badge variant="secondary" className="hidden sm:flex">
              Demo
            </Badge>
          )}

          <Button variant="outline" onClick={handleRecluster}>Re-cluster now</Button>

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
              <DropdownMenuItem onClick={handleProfileClick}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
