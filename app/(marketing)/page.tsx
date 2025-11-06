"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LandingPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-3xl mx-auto px-6 py-12 text-center space-y-8">
        <div className="space-y-6">
          {mounted && (
            <div className="flex justify-center">
              <Image
                src={isDark ? "/brand/klutr-logo-dark.png" : "/brand/klutr-logo-light.png"}
                alt="Klutr"
                width={320}
                height={107}
                className="w-48 md:w-64 lg:w-80 h-auto"
                priority
              />
            </div>
          )}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">
              Dump your brain. We'll clean it up.
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto text-balance">
              Capture chaos — links, voice notes, screenshots, half-sentences. We organize it and quietly bin the junk.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" asChild>
            <Link href="/app">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/app">See Live Demo</Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground pt-4">100% private. AI-powered organization. Yours, not ours.</p>
      </div>
    </div>
  )
}

