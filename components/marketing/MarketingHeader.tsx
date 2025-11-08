"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export default function MarketingHeader() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--klutr-outline)]/20 bg-[var(--klutr-background)]/95 dark:bg-[var(--klutr-surface-dark)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--klutr-background)]/60 dark:supports-[backdrop-filter]:bg-[var(--klutr-surface-dark)]/60">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {mounted && (
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={
                  isDark
                    ? "/logos/klutr-logo-dark-noslogan.svg"
                    : "/logos/klutr-logo-light-noslogan.svg"
                }
                alt="Klutr"
                width={240}
                height={80}
                className="h-12 md:h-16 w-auto"
                priority
              />
            </Link>
          )}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] hover:text-[var(--klutr-coral)] transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] hover:text-[var(--klutr-coral)] transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#discover"
              className="text-sm font-medium text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] hover:text-[var(--klutr-coral)] transition-colors"
            >
              Discover
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] hover:text-[var(--klutr-coral)] transition-colors"
            >
              About
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login" aria-label="Log in to your account">
                Log in
              </Link>
            </Button>
            <Button
              className="bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white"
              asChild
            >
              <Link href="/login" aria-label="Sign up for free beta">
                Sign Up
              </Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}

