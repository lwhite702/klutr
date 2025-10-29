"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  Brain,
  Layers,
  Lock,
  Eye,
  Calendar,
  Trash2,
} from "lucide-react";

const navItems = [
  { href: "/app", label: "Notes", icon: Lightbulb },
  { href: "/app/mindstorm", label: "MindStorm", icon: Brain },
  { href: "/app/stacks", label: "Smart Stacks", icon: Layers },
  { href: "/app/vault", label: "Vault", icon: Lock },
  { href: "/app/insights", label: "Insights", icon: Eye },
  { href: "/app/memory", label: "Memory Lane", icon: Calendar },
  { href: "/app/nope", label: "Nope Bin", icon: Trash2 },
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
            <Link href={item.href}>
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
