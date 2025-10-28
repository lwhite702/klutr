"use client"

import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface VaultLockScreenProps {
  onUnlock: () => void
}

export function VaultLockScreen({ onUnlock }: VaultLockScreenProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-6 p-12">
          <div className="rounded-full bg-muted p-6">
            <Lock className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">Vault is locked</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm text-muted-foreground cursor-help">Your private notes are secure</p>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Vault notes are encrypted with your key before they leave your device.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button onClick={onUnlock} size="lg" className="w-full">
            Unlock
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
