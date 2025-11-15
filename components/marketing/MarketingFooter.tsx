import Image from "next/image"
import Link from "next/link"
import React from "react"
import { getLatestChangelogEntries, getUpcomingRoadmapItems } from "@/lib/queries"
import { Sparkles, Calendar } from "lucide-react"

function FooterWidgets({
  latestReleases,
  upcomingItems,
}: {
  latestReleases: Awaited<ReturnType<typeof getLatestChangelogEntries>>
  upcomingItems: Awaited<ReturnType<typeof getUpcomingRoadmapItems>>
}) {
  return (
    <div className="grid md:grid-cols-2 gap-8 mb-8">
      {/* Latest Release */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-[var(--klutr-coral)]" />
          <h3 className="font-semibold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
            Latest Release
          </h3>
        </div>
        {latestReleases.length > 0 ? (
          <ul className="space-y-3">
            {latestReleases.map((entry) => (
              <li key={entry._id}>
                <Link
                  href="/changelog"
                  className="block text-sm text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)] transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="group-hover:underline">{entry.title}</span>
                    {entry.version && (
                      <span className="text-xs text-[var(--klutr-text-primary-light)]/50 dark:text-[var(--klutr-text-primary-dark)]/50 whitespace-nowrap">
                        v{entry.version}
                      </span>
                    )}
                  </div>
                  {entry.releaseDate && (
                    <p className="text-xs text-[var(--klutr-text-primary-light)]/50 dark:text-[var(--klutr-text-primary-dark)]/50 mt-1">
                      {new Date(entry.releaseDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[var(--klutr-text-primary-light)]/50 dark:text-[var(--klutr-text-primary-dark)]/50">
            No releases yet
          </p>
        )}
        <Link
          href="/changelog"
          className="text-xs text-[var(--klutr-coral)] hover:underline mt-2 inline-block"
        >
          View all →
        </Link>
      </div>

      {/* Next Up */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-[var(--klutr-coral)]" />
          <h3 className="font-semibold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
            Next Up
          </h3>
        </div>
        {upcomingItems.length > 0 ? (
          <ul className="space-y-3">
            {upcomingItems.map((item) => (
              <li key={item._id}>
                <Link
                  href="/roadmap"
                  className="block text-sm text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)] transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="group-hover:underline">{item.title}</span>
                    {item.status && (
                      <span className="text-xs text-[var(--klutr-text-primary-light)]/50 dark:text-[var(--klutr-text-primary-dark)]/50 whitespace-nowrap capitalize">
                        {item.status.replace("-", " ")}
                      </span>
                    )}
                  </div>
                  {item.targetDate && (
                    <p className="text-xs text-[var(--klutr-text-primary-light)]/50 dark:text-[var(--klutr-text-primary-dark)]/50 mt-1">
                      {new Date(item.targetDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[var(--klutr-text-primary-light)]/50 dark:text-[var(--klutr-text-primary-dark)]/50">
            No upcoming items yet
          </p>
        )}
        <Link
          href="/roadmap"
          className="text-xs text-[var(--klutr-coral)] hover:underline mt-2 inline-block"
        >
          View roadmap →
        </Link>
      </div>
    </div>
  )
}

function MarketingFooterContent({
  latestReleases,
  upcomingItems,
}: {
  latestReleases: Awaited<ReturnType<typeof getLatestChangelogEntries>>
  upcomingItems: Awaited<ReturnType<typeof getUpcomingRoadmapItems>>
}) {
  return (
    <footer className="bg-background dark:bg-[var(--klutr-surface-dark)] border-t border-[var(--klutr-outline)]/20 py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <FooterLogo />
            <p className="text-sm text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
              Organize your chaos. Keep the spark.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
              Product
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/features"
                  className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)] transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/roadmap"
                  className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)] transition-colors"
                >
                  Roadmap
                </Link>
              </li>
              <li>
                <Link
                  href="/changelog"
                  className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)] transition-colors"
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
              Resources
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/blog"
                  className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)] transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href={process.env.NEXT_PUBLIC_DOCS_URL || "https://help.klutr.app"}
                  className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Help Center
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

        <FooterWidgets latestReleases={latestReleases} upcomingItems={upcomingItems} />

        <div className="pt-8 border-t border-[var(--klutr-outline)]/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
            &copy; {new Date().getFullYear()} Klutr. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {(process.env.NODE_ENV === "development" ||
              (typeof process !== "undefined" &&
                process.env.NEXT_PUBLIC_BASEHUB_PROJECT_ID)) && (
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

// Export the content component as default for use in pages
export default MarketingFooterContent

// Export async wrapper for pages that want to fetch data
export async function MarketingFooterWithData() {
  const [latestReleases, upcomingItems] = await Promise.all([
    getLatestChangelogEntries(2),
    getUpcomingRoadmapItems(2),
  ])
  
  return <MarketingFooterContent latestReleases={latestReleases} upcomingItems={upcomingItems} />
}

function FooterLogo() {
  return (
    <div className="relative">
      <Image
        src="/logos/klutr-logo-light.svg"
        alt="Klutr"
        width={200}
        height={67}
        className="h-10 w-auto dark:hidden"
      />
      <Image
        src="/logos/klutr-logo-dark.svg"
        alt="Klutr"
        width={200}
        height={67}
        className="h-10 w-auto hidden dark:block"
      />
    </div>
  )
}

