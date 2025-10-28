import type React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarNav } from "./SidebarNav"
import { TopBar } from "./TopBar"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r bg-background flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold">NoteApp</h1>
        </div>
        <SidebarNav />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <ScrollArea className="flex-1">
          <main className="p-6">{children}</main>
        </ScrollArea>
      </div>
    </div>
  )
}
