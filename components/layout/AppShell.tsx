"use client";

import type React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarNav } from "./SidebarNav";
import { TopBar } from "./TopBar";

interface AppShellProps {
  children: React.ReactNode;
  activeRoute: string;
  showDemoBadge?: boolean;
}

export function AppShell({
  children,
  activeRoute,
  showDemoBadge = false,
}: AppShellProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r bg-background flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center">
            <Image
              src={isDark ? "/logos/klutr-logo-dark-noslogan.svg" : "/logos/klutr-logo-light-noslogan.svg"}
              alt="Klutr"
              width={120}
              height={40}
              className="h-8 md:h-10 lg:h-12 w-auto"
              priority
            />
          </div>
        </div>
        <SidebarNav activeRoute={activeRoute} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar showDemoBadge={showDemoBadge} />
        <ScrollArea className="flex-1">
          <main className="p-6 md:p-8">{children}</main>
        </ScrollArea>
      </div>
    </div>
  );
}
