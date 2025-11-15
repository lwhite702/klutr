"use client";

import type React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarNav } from "./SidebarNav";
import { TopBar } from "./TopBar";

interface AppShellProps {
  children: React.ReactNode;
  showDemoBadge?: boolean;
}

/**
 * AppShell - Fintask-inspired authenticated app shell
 * 
 * Structure:
 * - Left sidebar: Persistent navigation (256px)
 * - Main column: Stream/content area (flexible, max-width centered on large screens)
 * - Right panel area: Reserved space for panels (handled by PanelContainer overlays)
 * 
 * Visual design inspired by Fintask task management UI kit while maintaining
 * Klutr brand identity and stream-first architecture.
 */
export function AppShell({
  children,
  showDemoBadge = false,
}: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left Sidebar - Persistent Navigation */}
      <aside className="hidden md:flex w-64 border-r bg-background/95 backdrop-blur-sm flex-col shrink-0">
        <SidebarNav />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar showDemoBadge={showDemoBadge} />
        <ScrollArea className="flex-1">
          <main className="h-full">{children}</main>
        </ScrollArea>
      </div>
    </div>
  );
}
