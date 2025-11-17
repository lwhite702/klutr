"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";

/**
 * AdminLayout - Admin portal shell with sidebar and topbar
 * 
 * Structure:
 * - Left sidebar: 240px fixed width (admin navigation)
 * - Main content: Flexible with max-width constraint
 * - Top bar: Environment badge, admin identity, quick actions
 */
export function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left Sidebar - 240px fixed width */}
      <aside className="hidden md:flex w-[240px] border-r bg-background flex-col">
        <AdminSidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar - 64px height */}
        <AdminTopBar />
        
        {/* Scrollable Content Area */}
        <ScrollArea className="flex-1">
          <main className="p-6">{children}</main>
        </ScrollArea>
      </div>
    </div>
  );
}

