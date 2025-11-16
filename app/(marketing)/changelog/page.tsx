import {
  getChangelogEntries,
} from "@/lib/queries";
import { getPageMetadata } from "@/lib/queries/metadata";
import type { Metadata } from "next";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import {
  AnimatedSection,
  AnimatedItem,
} from "@/components/marketing/AnimatedSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMetadata("changelog");

  return {
    title: meta?.seoTitle ?? "Changelog — Klutr",
    description:
      meta?.metaDescription ??
      "See what's new in Klutr. Latest features, improvements, and updates to help you clear the clutr.",
    openGraph: {
      title: meta?.seoTitle ?? "Changelog — Klutr",
      description:
        meta?.metaDescription ??
        "See what's new in Klutr. Latest features, improvements, and updates to help you clear the clutr.",
      url: "https://klutr.app/changelog",
      siteName: "Klutr",
    },
  };
}

function CategoryBadge({ category }: { category: string | null }) {
  if (!category) return null;

  const categoryConfig = {
    feature: {
      label: "Feature",
      className: "bg-[var(--klutr-coral)]/20 text-[var(--klutr-coral)]",
    },
    ui: {
      label: "UI",
      className:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    },
    infra: {
      label: "Infra",
      className:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    },
    docs: {
      label: "Docs",
      className:
        "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    },
    risk: {
      label: "Risk",
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    },
  };

  const config =
    categoryConfig[category as keyof typeof categoryConfig] ||
    categoryConfig.docs;

  return <Badge className={config.className}>{config.label}</Badge>;
}

export default async function ChangelogPage() {
  const changelogEntries = await getChangelogEntries();


  // Group entries by release date (month/year)
  const groupedEntries = changelogEntries.reduce((acc, entry) => {
    if (!entry.releaseDate) {
      const key = "No Date";
      if (!acc[key]) acc[key] = [];
      acc[key].push(entry);
      return acc;
    }

    const date = new Date(entry.releaseDate);
    const key = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {} as Record<string, typeof changelogEntries>);

  // Sort groups by date (most recent first)
  const sortedGroups = Object.entries(groupedEntries).sort((a, b) => {
    if (a[0] === "No Date") return 1;
    if (b[0] === "No Date") return -1;
    return new Date(b[0]).getTime() - new Date(a[0]).getTime();
  });

  return (
    <div className="min-h-screen bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
      <MarketingHeader />

      <main className="container mx-auto px-6 py-20">
        <AnimatedSection className="space-y-12">
          <AnimatedItem className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
              Changelog
            </h1>
            <p className="text-lg text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
              See what's new in Klutr. We ship updates regularly to make your
              note-taking experience better.
            </p>
          </AnimatedItem>

          {changelogEntries.length === 0 ? (
            <AnimatedItem className="text-center py-12">
              <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                Changelog entries will appear here once they're added to
                BaseHub.
              </p>
            </AnimatedItem>
          ) : (
            <div className="space-y-12">
              {sortedGroups.map(([groupDate, entries]) => (
                <AnimatedItem key={groupDate} className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-[var(--klutr-coral)]" />
                    <h2 className="text-2xl md:text-3xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                      {groupDate}
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {entries.map((entry) => (
                      <Card
                        key={entry._id}
                        className="border-[var(--klutr-outline)]/20 hover:border-[var(--klutr-coral)]/30 transition-colors"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <CardTitle className="text-xl mb-2">
                                {entry.title}
                              </CardTitle>
                              {entry.version && (
                                <Badge variant="outline" className="text-xs">
                                  v{entry.version}
                                </Badge>
                              )}
                            </div>
                            <CategoryBadge category={entry.category} />
                          </div>
                          {entry.releaseDate && (
                            <p className="text-xs text-[var(--klutr-text-primary-light)]/60 dark:text-[var(--klutr-text-primary-dark)]/60">
                              {new Date(entry.releaseDate).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          )}
                        </CardHeader>
                        <CardContent>
                          {entry.description && (
                            <p className="text-sm text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                              {entry.description}
                            </p>
                          )}
                          {entry.tags && entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {entry.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AnimatedItem>
              ))}
            </div>
          )}
        </AnimatedSection>
      </main>

      <MarketingFooter />
    </div>
  );
}
