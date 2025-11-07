"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet"
import { SidebarNav } from "./SidebarNav"

export function MobileNavSheet() {
  const [open, setOpen] = useState(false)
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center">
            {mounted && (
              <Image
                src={isDark ? "/logos/klutr-logo-dark-noslogan.svg" : "/logos/klutr-logo-light-noslogan.svg"}
                alt="Klutr"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            )}
          </div>
        </SheetHeader>
        <SidebarNav />
      </SheetContent>
    </Sheet>
  )
}
