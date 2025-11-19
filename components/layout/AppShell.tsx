"use client";

import type React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarNav } from "./SidebarNav";
import { TopBar } from "./TopBar";

interface AppShellProps {
  children: React.ReactNode;
  activeRoute?: string;
  showDemoBadge?: boolean;
}

/**
 * AppShell - Fintask-inspired 3-part layout structure
 *
 * Structure:
 * - Left sidebar: 240px fixed width (persistent navigation)
 * - Main column: Flexible with max-width constraint (Stream/content)
 * - Right panel area: Visual constraint for panels (handled by PanelContainer overlays)
 *
 * Spacing matches Fintask proportions:
 * - Sidebar: 240px
 * - Header: 64px height
 * - Content padding: 24px
 * - Card spacing: 16px vertical gap
 */
export function AppShell({
  children,
  activeRoute,
  showDemoBadge = false,
}: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left Sidebar - 240px fixed width (matches Fintask) */}
      <aside className="hidden md:flex w-[240px] border-r bg-background flex-col">
        <SidebarNav />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar - 64px height (matches Fintask) */}
        <TopBar showDemoBadge={showDemoBadge} />

        {/* Scrollable Content Area */}
        <ScrollArea className="flex-1">
          <main className="p-6">{children}</main>
        </ScrollArea>
      </div>

      {/* Right Panel Area - Visual constraint for panels
          Panels are rendered as overlays via PanelContainer in individual pages */}
    </div>
  );
}
