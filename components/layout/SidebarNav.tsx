"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  LayoutDashboard,
  Sparkles,
  Lock,
  Search,
  Settings,
  Brain,
  Clock,
  Trash,
} from "lucide-react";
import posthog from 'posthog-js';
import { brandColors } from "@/lib/brand";
import { usePanelState, type PanelType } from "@/lib/hooks/usePanelState";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Panel items (open as overlays in stream)
const panelItems = [
  {
    id: 'mindstorm' as PanelType,
    label: "MindStorm",
    icon: Brain,
    color: brandColors.coral,
    shortcut: "M",
  },
  {
    id: 'insights' as PanelType,
    label: "Insights",
    icon: Sparkles,
    color: brandColors.mint,
    shortcut: "I",
  },
  {
    id: 'memory' as PanelType,
    label: "Memory",
    icon: Clock,
    color: brandColors.coral,
    shortcut: "H",
  },
  {
    id: 'search' as PanelType,
    label: "Search",
    icon: Search,
    color: "text-muted-foreground",
    shortcut: "K",
  },
];

// Page items (navigate to full pages)
const pageItems = [
  {
    href: "/app/stream",
    label: "Stream",
    icon: Lightbulb,
    color: brandColors.coral,
  },
  {
    href: "/app/boards",
    label: "Boards",
    icon: LayoutDashboard,
    color: brandColors.mint,
  },
  {
    href: "/app/vault",
    label: "Vault",
    icon: Lock,
    color: brandColors.coral,
  },
  {
    href: "/app/nope",
    label: "Nope Bin",
    icon: Trash,
    color: "text-muted-foreground",
  },
  {
    href: "/app/settings",
    label: "Settings",
    icon: Settings,
    color: "text-muted-foreground",
  },
];

// Helper function to get icon styles based on color prop
function getIconStyles(color: string) {
  if (typeof color === 'string' && color.startsWith('text-')) {
    return { className: color, style: undefined };
  }
  if (typeof color === 'string' && !color.startsWith('text-')) {
    return { className: '', style: { color } };
  }
  return { className: '', style: undefined };
}

export function SidebarNav() {
  const pathname = usePathname();
  const { activePanel, openPanel } = usePanelState();

  return (
    <TooltipProvider>
      <nav className="flex flex-col gap-1 p-4">
        {/* Page Links */}
        {pageItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Button
              key={item.href}
              variant="ghost"
              className={`justify-start gap-3 ${isActive ? "bg-accent" : ""}`}
              asChild
            >
              <Link href={item.href} onClick={() => {
                posthog.capture('sidebar_navigation_link_clicked', {
                  target_href: item.href,
                  target_label: item.label,
                });
              }}>
                <Icon
                  className={`h-4 w-4 ${getIconStyles(item.color).className}`}
                  style={getIconStyles(item.color).style}
                />
                {item.label}
              </Link>
            </Button>
          );
        })}

        {/* Divider */}
        <div className="my-2 border-t" />

        {/* Panel Triggers */}
        {panelItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePanel === item.id;

          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={`justify-start gap-3 ${isActive ? "bg-accent" : ""}`}
                  onClick={() => {
                    openPanel(item.id);
                    posthog.capture('sidebar_panel_opened', {
                      panel: item.id,
                      label: item.label,
                    });
                  }}
                >
                  <Icon
                    className={`h-4 w-4 ${getIconStyles(item.color).className}`}
                    style={getIconStyles(item.color).style}
                  />
                  {item.label}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label} (⌘{item.shortcut})</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </TooltipProvider>
  );
}
