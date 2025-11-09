"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
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
import { HelpCircle, Sun, Moon, Plus } from "lucide-react";
import { brandColors } from "@klutr/brand";
import { HelpCenter } from "@/components/help/HelpCenter";

export function TopBar({ showDemoBadge = false }: { showDemoBadge?: boolean }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [demoMode, setDemoMode] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

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
    <header className="border-b bg-gradient-to-r from-[var(--klutr-mint)]/10 to-transparent sticky top-0 z-10 backdrop-blur-sm">
      <div className="flex items-center gap-4 p-4">
        <MobileNavSheet />

        <div className="flex-1 max-w-md">
          <Input placeholder="Search your stream..." className="w-full" />
        </div>

        <div className="flex items-center gap-2 ml-auto">
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
                  style={{
                    backgroundColor: brandColors.coral,
                    color: "#ffffff",
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Drop
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
