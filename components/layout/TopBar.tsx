"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
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
import { HelpCircle, Sun, Moon, Plus, Search } from "lucide-react";
import { HelpCenter } from "@/components/help/HelpCenter";
import { usePanelState } from "@/lib/hooks/usePanelState";

/**
 * TopBar - Fintask-inspired header with prominent Klutr branding
 * 
 * Structure:
 * - Left: Brand section (Klutr logo + wordmark + tagline)
 * - Center: Context area (optional page title/breadcrumbs)
 * - Right: User actions (avatar, theme toggle, help, quick actions)
 */
export function TopBar({ showDemoBadge = false }: { showDemoBadge?: boolean }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { openPanel } = usePanelState();
  const [demoMode, setDemoMode] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
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

  return (
    <header className="border-b bg-background sticky top-0 z-10 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-6 px-6 py-4 h-16">
        {/* Left: Brand Section */}
        <div className="flex items-center gap-4 shrink-0">
          <MobileNavSheet />
          
          {/* Klutr Logo - Larger and more prominent */}
          <div className="hidden md:flex items-center gap-3">
            <Image
              src={isDark ? "/logos/klutr-logo-dark-noslogan.svg" : "/logos/klutr-logo-light-noslogan.svg"}
              alt="Klutr"
              width={140}
              height={48}
              className="h-10 w-auto"
              priority
            />
            <div className="hidden lg:block">
              <p className="text-xs text-muted-foreground leading-tight">
                Organize your chaos.<br />Keep the spark.
              </p>
            </div>
          </div>
        </div>

        {/* Center: Context Area (can be used for page titles/breadcrumbs) */}
        <div className="flex-1 min-w-0" />

        {/* Right: User Actions */}
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
                  onClick={() => {
                    // Navigate to stream and focus input
                    window.location.href = "/app/stream";
                  }}
                  className="bg-accent-coral text-white hover:bg-accent-coral/90"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Drop</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Quickly add a note, file, or voice recording to your stream
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openPanel('search')}
                  aria-label="Search (⌘K)"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Search (⌘K)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setHelpOpen(true)}
                  aria-label="Help & documentation"
                >
                  <HelpCircle className="h-5 w-5" />
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
                >
                  {mounted ? (
                    resolvedTheme === "dark" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )
                  ) : (
                    <Moon className="h-5 w-5" />
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
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
