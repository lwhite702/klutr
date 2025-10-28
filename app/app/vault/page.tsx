"use client"

import { AppShell } from "@/components/layout/AppShell"
import { VaultLockScreen } from "@/components/vault/VaultLockScreen"

export default function VaultPage() {
  return (
    <AppShell activeRoute="/app/vault">
      <VaultLockScreen />
    </AppShell>
  )
}