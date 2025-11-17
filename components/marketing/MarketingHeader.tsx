"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  designColors,
  shadows,
  borderRadius,
  spacing,
} from "@/lib/design-tokens";

export default function MarketingHeader() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 py-5">
      <div className="container mx-auto px-6 max-w-[1440px]">
        <nav
          className="bg-white rounded-[24px] shadow-[0px_8px_100px_rgba(0,0,0,0.03)] px-6 py-4 flex items-center justify-between"
          style={{ boxShadow: shadows.header }}
        >
          {mounted && (
            <Link
              href="/"
              className="flex items-center transition-transform duration-300 hover:scale-105"
            >
              <Image
                src={isDark ? "/logos/klutr-logo-dark.svg" : "/logos/klutr-logo-light.svg"}
                alt="Klutr"
                width={160}
                height={80}
                className="h-12 md:h-16 w-auto"
                priority
              />
            </Link>
          )}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/features"
              className="text-lg font-normal text-black hover:text-[var(--klutr-coral)] transition-colors"
            >
              Features
            </Link>
            <Link
              href="/neurodivergent"
              className="text-lg font-normal text-black hover:text-[var(--klutr-coral)] transition-colors"
            >
              For Neurodivergent Minds
            </Link>
            <Link
              href="/compare"
              className="text-lg font-normal text-black hover:text-[var(--klutr-coral)] transition-colors"
            >
              Compare Us
            </Link>
            <Link
              href="/pricing"
              className="text-lg font-normal text-black hover:text-[var(--klutr-coral)] transition-colors"
            >
              Pricing
            </Link>
            <Link
              href={
                process.env.NEXT_PUBLIC_DOCS_URL || "https://help.klutr.app"
              }
              className="text-lg font-normal text-black hover:text-[var(--klutr-coral)] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Help
            </Link>
          </div>
          <Button
            className="bg-white border-[3px] border-black rounded-[52px] px-[30px] py-[15px] text-black font-bold text-lg hover:bg-gray-50 transition-all"
            style={{
              boxShadow: "4px 4px 0px #000000",
            }}
            asChild
          >
            <Link href="/login" aria-label="Join free beta">
              Join Free
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
