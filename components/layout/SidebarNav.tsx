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
    <nav className="flex flex-col h-full">
      {/* Logo Section - Moved to TopBar, keeping minimal branding here */}
      <div className="p-6 pb-4 border-b">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Navigation
        </div>
      </div>

      {/* Page Links Section */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {pageItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Button
                key={item.href}
                variant="ghost"
                className={`w-full justify-start gap-3 h-9 px-3 ${
                  isActive 
                    ? "bg-accent text-accent-foreground font-medium" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
                asChild
              >
                <Link 
                  href={item.href} 
                  onClick={() => {
                    posthog.capture('sidebar_navigation_link_clicked', {
                      target_href: item.href,
                      target_label: item.label,
                    });
                  }}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${getIconStyles(item.color).className}`}
                    style={getIconStyles(item.color).style}
                    aria-hidden="true"
                  />
                  <span className="flex-1 text-sm">{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-4 border-t" />

        {/* Panel Triggers Section */}
        <div className="space-y-1">
          <div className="px-3 mb-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Quick Access
            </div>
          </div>
          {panelItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePanel === item.id;

            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-between gap-3 h-9 px-3 ${
                  isActive 
                    ? "bg-accent text-accent-foreground font-medium" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
                onClick={() => {
                  openPanel(item.id);
                  posthog.capture('sidebar_panel_opened', {
                    panel: item.id,
                    label: item.label,
                  });
                }}
                aria-label={`${item.label} panel (⌘${item.shortcut})`}
                aria-pressed={isActive}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${getIconStyles(item.color).className}`}
                    style={getIconStyles(item.color).style}
                    aria-hidden="true"
                  />
                  <span className="text-sm">{item.label}</span>
                </div>
                {/* Visible keyboard shortcut hint */}
                <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-60">
                  <span className="text-xs">⌘</span>
                  {item.shortcut}
                </kbd>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
