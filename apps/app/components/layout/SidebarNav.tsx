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
} from "lucide-react";
import posthog from 'posthog-js';
import { brandColors } from "@klutr/brand";

const navItems = [
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
    href: "/app/muse",
    label: "Muse",
    icon: Sparkles,
    color: brandColors.mint,
  },
  {
    href: "/app/vault",
    label: "Vault",
    icon: Lock,
    color: brandColors.coral,
  },
  {
    href: "/app/search",
    label: "Search",
    icon: Search,
    color: "text-muted-foreground",
  },
  {
    href: "/app/settings",
    label: "Settings",
    icon: Settings,
    color: "text-muted-foreground",
  },
];

interface SidebarNavProps {
  activeRoute?: string;
}

export function SidebarNav({ activeRoute }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeRoute
          ? pathname === activeRoute
          : pathname === item.href;

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
                className={`h-4 w-4 ${
                  typeof item.color === "string" && item.color.startsWith("text-")
                    ? item.color
                    : ""
                }`}
                style={{
                  color:
                    typeof item.color === "string" && !item.color.startsWith("text-")
                      ? item.color
                      : undefined,
                }}
              />
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
