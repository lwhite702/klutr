"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"

export default function MarketingFooter() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <footer className="bg-background dark:bg-[var(--klutr-surface-dark)] border-t border-[var(--klutr-outline)]/20 py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            {mounted && (
              <Image
                src={
                  isDark
                    ? "/logos/klutr-logo-dark.svg"
                    : "/logos/klutr-logo-light.svg"
                }
                alt="Klutr"
                width={200}
                height={67}
                className="h-10 w-auto"
              />
            )}
            <p className="text-sm text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
              Clear the clutr. Keep the spark.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
              Product
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#features"
                  className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)] transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)] transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#about"
                  className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)] transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#discover"
                  className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)] transition-colors"
                >
                  Discover
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)] transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)] transition-colors"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-[var(--klutr-outline)]/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
            &copy; {new Date().getFullYear()} Klutr. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {(process.env.NODE_ENV === "development" ||
              (typeof window !== "undefined" &&
                (window.location.search.includes("preview") ||
                  window.location.search.includes("draft")))) &&
              process.env.NEXT_PUBLIC_BASEHUB_PROJECT_ID && (
                <Link
                  href={`https://basehub.com/projects/${process.env.NEXT_PUBLIC_BASEHUB_PROJECT_ID}/collections/pages`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--klutr-text-primary-light)]/50 dark:text-[var(--klutr-text-primary-dark)]/50 hover:text-[var(--klutr-coral)] transition-colors"
                >
                  Edit in BaseHub
                </Link>
              )}
            <Link
              href="/privacy"
              className="text-sm text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)] transition-colors"
            >
              Privacy policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

