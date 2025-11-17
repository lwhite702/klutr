"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Brain,
  Activity,
  Settings,
  FileText,
  Server,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { brandColors } from "@/lib/brand";

// Navigation groups
const navGroups = [
  {
    label: "Overview",
    items: [
      {
        href: "/admin",
        label: "Overview",
        icon: LayoutDashboard,
        color: brandColors.coral,
      },
    ],
  },
  {
    label: "Users",
    items: [
      {
        href: "/admin/users",
        label: "Users",
        icon: Users,
        color: brandColors.mint,
      },
    ],
  },
  {
    label: "AI",
    items: [
      {
        href: "/admin/ai",
        label: "Usage",
        icon: Activity,
        color: brandColors.coral,
      },
      {
        href: "/admin/ai/models",
        label: "Models",
        icon: Brain,
        color: brandColors.mint,
      },
      {
        href: "/admin/ai/features",
        label: "Features",
        icon: Settings,
        color: brandColors.coral,
      },
      {
        href: "/admin/ai/logs",
        label: "Logs",
        icon: FileText,
        color: brandColors.mint,
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        href: "/admin/system",
        label: "Health",
        icon: Server,
        color: brandColors.coral,
      },
      {
        href: "/admin/system/logs",
        label: "Logs",
        icon: AlertCircle,
        color: brandColors.mint,
      },
    ],
  },
];

/**
 * AdminSidebar - Navigation for admin portal
 */
export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5 p-3">
      {navGroups.map((group, groupIdx) => (
        <div key={group.label}>
          {/* Group Label */}
          {groupIdx > 0 && (
            <div className="my-2 border-t border-border" />
          )}
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {group.label}
          </div>

          {/* Group Items */}
          {group.items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "justify-start gap-3 h-10 px-3 rounded-md text-sm font-medium w-full",
                  "hover:bg-accent/50 transition-colors",
                  isActive && "bg-accent border-l-2"
                )}
                style={isActive ? { borderLeftColor: brandColors.coral } : undefined}
                asChild
              >
                <Link 
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    className="h-5 w-5 flex-shrink-0"
                    style={{ color: item.color }}
                    aria-hidden="true"
                  />
                  <span className="flex-1 text-left">{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

