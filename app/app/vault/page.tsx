"use client"

import { AppShell } from "@/components/AppShell"
import { VaultLockScreen } from "@/components/VaultLockScreen"

export default function VaultPage() {
  return (
    <AppShell activeRoute="/app/vault" showDemoBadge>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Vault</h1>
            <p className="text-muted-foreground">Your most private notes, encrypted and secure.</p>
          </div>
        </div>

        <VaultLockScreen />
      </div>
    </AppShell>
  )
}
