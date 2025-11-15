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
import { cn } from "@/lib/utils";

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
    color: brandColors.mint,
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
    color: brandColors.mint,
  },
  {
    href: "/app/settings",
    label: "Settings",
    icon: Settings,
    color: "muted",
  },
];

/**
 * SidebarNav - Fintask-inspired navigation with keyboard shortcut hints
 * 
 * Visual Design:
 * - Compact icons (20px)
 * - Clear selected state with background color and left border indicator
 * - Subtle background on active item
 * - Keyboard shortcut hints visible (right-aligned, low-contrast)
 * - Font sizes: 14px labels, 11px shortcuts
 */
export function SidebarNav() {
  const pathname = usePathname();
  const { activePanel, openPanel } = usePanelState();

  // Helper function to get icon styles based on color prop
  function getIconStyles(color: string | typeof brandColors.coral) {
    if (color === "muted") {
      return { className: "text-muted-foreground", style: undefined };
    }
    if (typeof color === 'string' && color.startsWith('text-')) {
      return { className: color, style: undefined };
    }
    if (typeof color === 'string' && !color.startsWith('text-')) {
      return { className: '', style: { color } };
    }
    return { className: '', style: undefined };
  }

  return (
    <nav className="flex flex-col gap-0.5 p-3">
      {/* Page Links */}
      {pageItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Button
            key={item.href}
            variant="ghost"
            className={cn(
              "justify-start gap-3 h-10 px-3 rounded-md text-sm font-medium",
              "hover:bg-accent/50 transition-colors",
              isActive && "bg-accent border-l-2 border-l-[var(--klutr-coral)]"
            )}
            style={isActive ? { borderLeftColor: brandColors.coral } : undefined}
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
                className={cn(
                  "h-5 w-5 flex-shrink-0",
                  getIconStyles(item.color).className
                )}
                style={getIconStyles(item.color).style}
                aria-hidden="true"
              />
              <span className="flex-1 text-left">{item.label}</span>
            </Link>
          </Button>
        );
      })}

      {/* Divider */}
      <div className="my-2 border-t border-border" />

      {/* Panel Triggers */}
      {panelItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePanel === item.id;

        return (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              "justify-between gap-3 h-10 px-3 rounded-md text-sm font-medium w-full",
              "hover:bg-accent/50 transition-colors",
              isActive && "bg-accent border-l-2"
            )}
            style={isActive ? { borderLeftColor: brandColors.coral } : undefined}
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
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Icon
                className={cn(
                  "h-5 w-5 flex-shrink-0",
                  getIconStyles(item.color).className
                )}
                style={getIconStyles(item.color).style}
                aria-hidden="true"
              />
              <span className="flex-1 text-left truncate">{item.label}</span>
            </div>
            {/* Keyboard shortcut hint - subtle, low-contrast */}
            <span className="text-[11px] text-muted-foreground/60 font-mono flex-shrink-0">
              ⌘{item.shortcut}
            </span>
          </Button>
        );
      })}
    </nav>
  );
}
