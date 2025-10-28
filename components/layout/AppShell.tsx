"use client"

import { SidebarNav } from "./SidebarNav"
import { TopBar } from "./TopBar"

interface AppShellProps {
  children: React.ReactNode
  activeRoute: string
  showDemoBadge?: boolean
}

export function AppShell({ children, activeRoute, showDemoBadge = false }: AppShellProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <SidebarNav activeRoute={activeRoute} />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar showDemoBadge={showDemoBadge} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}