"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export default function MarketingHeader() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-[var(--klutr-outline)]/30 bg-[var(--klutr-background)]/90 dark:bg-[var(--klutr-surface-dark)]/90 shadow-sm"
          : "border-[var(--klutr-outline)]/20 bg-[var(--klutr-background)]/80 dark:bg-[var(--klutr-surface-dark)]/80"
      } backdrop-blur-md`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {mounted && (
            <Link
              href="/"
              className="flex items-center gap-2 transition-transform duration-300 hover:scale-105"
            >
              <Image
                src={
                  isDark
                    ? "/logos/klutr-logo-dark-noslogan.svg"
                    : "/logos/klutr-logo-light-noslogan.svg"
                }
                alt="Klutr"
                width={336}
                height={112}
                className="h-16 md:h-20 lg:h-24 w-auto"
                priority
              />
            </Link>
          )}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] hover:text-[var(--klutr-coral)] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/features"
              className="text-sm font-medium text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] hover:text-[var(--klutr-coral)] transition-colors"
            >
              Features
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] hover:text-[var(--klutr-coral)] transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/help"
              className="text-sm font-medium text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] hover:text-[var(--klutr-coral)] transition-colors"
            >
              Help
            </Link>
          </div>
          <Button
            className="bg-gradient-to-r from-[#FF6B6B] to-[#5ED0BD] hover:opacity-90 text-white shadow-sm"
            asChild
          >
            <Link href="/login" aria-label="Join free beta">
              Join Free Beta
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}

