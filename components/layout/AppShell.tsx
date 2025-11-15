"use client";

import type React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarNav } from "./SidebarNav";
import { TopBar } from "./TopBar";
import { usePanelState } from "@/lib/hooks/usePanelState";

interface AppShellProps {
  children: React.ReactNode;
  showDemoBadge?: boolean;
}

/**
 * AppShell - Fintask-inspired authenticated app shell
 * 
 * Structure:
 * - Left sidebar: Persistent navigation (fixed width)
 * - Main column: Primary content area (Stream-focused)
 * - Right panel area: Reserved space for panels on desktop (visual constraint)
 * 
 * Panels still use PanelContainer overlays, but the right area provides
 * visual structure and prevents content from being too wide.
 */
export function AppShell({
  children,
  showDemoBadge = false,
}: AppShellProps) {
  const { activePanel } = usePanelState();
  const hasPanelOpen = activePanel !== null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left Sidebar - Persistent Navigation */}
      <aside className="hidden md:flex w-64 border-r bg-background flex-col shrink-0">
        <SidebarNav />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar - Shared across all authenticated routes */}
        <TopBar showDemoBadge={showDemoBadge} />
        
        {/* Main Content - Scrollable */}
        <ScrollArea className="flex-1">
          <main className="h-full">
            {children}
          </main>
        </ScrollArea>
      </div>

      {/* Right Panel Area - Visual constraint for desktop panels */}
      {/* Panels themselves are rendered via PanelContainer overlays */}
      {hasPanelOpen && (
        <div className="hidden lg:block w-[500px] shrink-0 border-l bg-muted/20" aria-hidden="true" />
      )}
    </div>
  );
}
