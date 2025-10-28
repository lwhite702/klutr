import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

export function VaultLockScreen() {
  const handleUnlock = () => {
    console.log("Unlock vault clicked")
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="p-8 max-w-md w-full text-center">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-muted">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Vault locked</h2>
            <p className="text-sm text-muted-foreground">
              Your private notes are encrypted and protected. 
              Unlock to access your secure vault.
            </p>
          </div>
          
          <Button onClick={handleUnlock} className="w-full">
            Unlock
          </Button>
        </div>
      </Card>
    </div>
  )
}