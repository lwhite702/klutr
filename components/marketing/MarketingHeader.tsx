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
              className="flex items-center gap-3 transition-transform duration-300 hover:scale-105"
            >
              <div className="w-10 h-10 bg-[var(--klutr-coral)] rounded-full flex items-center justify-center shadow-[inset_0px_0px_6px_rgba(255,255,255,0.25)]">
                <div className="w-6 h-6 bg-white rounded-full shadow-[inset_0px_5px_4px_var(--klutr-coral)]" />
              </div>
              <span className="text-[32px] font-bold leading-[40px] text-black hidden sm:block">
                Klutr
              </span>
            </Link>
          )}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/pricing"
              className="text-lg font-normal text-black hover:text-[var(--klutr-coral)] transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/features"
              className="text-lg font-normal text-black hover:text-[var(--klutr-coral)] transition-colors"
            >
              Features
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
