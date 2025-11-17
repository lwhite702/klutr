"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * AdminTopBar - Admin portal header
 * 
 * Features:
 * - Environment badge (dev, staging, prod)
 * - Current admin identity
 * - Quick actions (back to app, sign out)
 */
export function AdminTopBar() {
  const { user } = useCurrentUser();
  const [environment, setEnvironment] = useState<string>("dev");

  useEffect(() => {
    // Determine environment from URL or env var
    const hostname = window.location.hostname;
    if (hostname.includes("vercel.app") && !hostname.includes("localhost")) {
      setEnvironment("prod");
    } else if (hostname.includes("staging")) {
      setEnvironment("staging");
    } else {
      setEnvironment("dev");
    }
  }, []);

  const getEnvColor = (env: string) => {
    switch (env) {
      case "prod":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      case "staging":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      default:
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    }
  };

  return (
    <header className="h-16 border-b bg-background sticky top-0 z-10">
      <div className="flex items-center h-full px-6 gap-6">
        {/* Left: Admin Portal Title */}
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-lg font-semibold">Admin Portal</h1>
          <Badge
            variant="outline"
            className={cn("text-xs font-mono", getEnvColor(environment))}
          >
            {environment}
          </Badge>
        </div>

        {/* Center: Spacer */}
        <div className="flex-1" />

        {/* Right: Admin Actions */}
        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          <Link href="/app/stream">
            <Badge variant="secondary" className="cursor-pointer hover:bg-accent">
              Back to App
            </Badge>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-1.5 text-sm">
                <div className="font-medium">{user?.email || "Admin"}</div>
                <div className="text-xs text-muted-foreground">Administrator</div>
              </div>
              <DropdownMenuItem asChild>
                <Link href="/app/stream">Back to App</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/app/settings">Settings</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

