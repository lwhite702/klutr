"use client"

import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function VaultLockScreen() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-6 p-12">
          <div className="rounded-full bg-muted p-6">
            <Lock className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">Vault locked</h2>
            <p className="text-sm text-muted-foreground">Your private notes are encrypted and only visible to you.</p>
          </div>
          <Button onClick={handleUnlock} size="lg" className="w-full">
            Unlock
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
