"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MobileNavSheet } from "./MobileNavSheet";
import { isDemoMode } from "@/lib/onboarding";
import { HelpCircle, Sun, Moon } from "lucide-react";
import { HelpCenter } from "@/components/help/HelpCenter";
import { usePathname } from "next/navigation";
import { brandColors } from "@/lib/brand";

/**
 * TopBar - Fintask-inspired header with enhanced Klutr branding
 * 
 * Structure:
 * - Left: Klutr logo + wordmark + tagline (larger, more prominent)
 * - Center: Contextual page title or breadcrumbs (optional)
 * - Right: User actions (theme toggle, help, account menu)
 * 
 * Design goals:
 * - Increase Klutr logo presence (meaningfully larger than before)
 * - Clear visual hierarchy
 * - Consistent spacing and padding matching Fintask patterns
 */
export function TopBar({ showDemoBadge = false }: { showDemoBadge?: boolean }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [demoMode, setDemoMode] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
    setDemoMode(isDemoMode());
  }, []);

  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  const handleProfile = () => {
    console.log("[v0] Profile clicked");
  };

  const handleSignOut = () => {
    console.log("[v0] Sign out clicked");
  };

  // Get page title based on route
  const getPageTitle = () => {
    if (pathname === "/app/stream") return "Stream";
    if (pathname === "/app/boards") return "Boards";
    if (pathname === "/app/vault") return "Vault";
    if (pathname === "/app/nope") return "Nope Bin";
    if (pathname?.startsWith("/app/stacks/")) return "Stack";
    return null;
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-30 h-16">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left: Brand Section */}
        <div className="flex items-center gap-4 min-w-0">
          <MobileNavSheet />
          
          <Link 
            href="/app/stream" 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity shrink-0"
          >
            <Image
              src={isDark ? "/logos/klutr-logo-dark-noslogan.svg" : "/logos/klutr-logo-light-noslogan.svg"}
              alt="Klutr"
              width={100}
              height={32}
              className="h-7 w-auto"
              priority
            />
            <div className="hidden lg:flex flex-col">
              <span className="text-sm font-semibold leading-tight">Klutr</span>
              <span className="text-xs text-muted-foreground leading-tight">
                Organize your chaos. Keep the spark.
              </span>
            </div>
          </Link>

          {/* Page Title (on larger screens) */}
          {getPageTitle() && (
            <div className="hidden xl:flex items-center gap-2 ml-6 pl-6 border-l">
              <span className="text-sm font-medium text-muted-foreground">
                {getPageTitle()}
              </span>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {(demoMode || showDemoBadge) && (
            <Badge variant="secondary" className="hidden sm:flex">
              demo
            </Badge>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setHelpOpen(true)}
                  aria-label="Help & documentation"
                  className="h-9 w-9"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Help & documentation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="h-9 w-9"
                >
                  {mounted ? (
                    resolvedTheme === "dark" ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle theme</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="text-xs">U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleProfile}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <HelpCenter open={helpOpen} onOpenChange={setHelpOpen} />
    </header>
  );
}
