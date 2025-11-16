import { getRoadmapItems } from "@/lib/queries"
import { getPageMetadata } from "@/lib/queries/metadata"
import type { Metadata } from "next"
import MarketingHeader from "@/components/marketing/MarketingHeader"
import MarketingFooter from "@/components/marketing/MarketingFooter"
import {
  AnimatedSection,
  AnimatedItem,
} from "@/components/marketing/AnimatedSection"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Circle } from "lucide-react"

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMetadata("roadmap")

  return {
    title: meta?.seoTitle ?? "Roadmap — Klutr",
    description:
      meta?.metaDescription ??
      "See what's coming next to Klutr. Planned features, improvements, and updates to help you clear the clutr.",
    openGraph: {
      title: meta?.seoTitle ?? "Roadmap — Klutr",
      description:
        meta?.metaDescription ??
        "See what's coming next to Klutr. Planned features, improvements, and updates to help you clear the clutr.",
      url: "https://klutr.app/roadmap",
      siteName: "Klutr",
    },
  }
}

function StatusIcon({ status }: { status: string | null }) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-5 h-5 text-green-500" />
    case "in-progress":
      return <Clock className="w-5 h-5 text-[var(--klutr-coral)]" />
    case "planned":
      return <Circle className="w-5 h-5 text-gray-400" />
    default:
      return <Circle className="w-5 h-5 text-gray-400" />
  }
}

function StatusBadge({ status }: { status: string | null }) {
  const statusConfig = {
    completed: { label: "Completed", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
    "in-progress": { label: "In Progress", className: "bg-[var(--klutr-coral)]/20 text-[var(--klutr-coral)]" },
    planned: { label: "Planned", className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.planned

  return (
    <Badge className={config.className}>{config.label}</Badge>
  )
}

function PriorityBadge({ priority }: { priority: string | null }) {
  if (!priority) return null

  const priorityConfig = {
    high: { label: "High", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
    medium: { label: "Medium", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
    low: { label: "Low", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  }

  const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}

export default async function RoadmapPage() {
  const roadmapItems = await getRoadmapItems()
  

  // Group items by status
  const completed = roadmapItems.filter(item => item.status === "completed")
  const inProgress = roadmapItems.filter(item => item.status === "in-progress")
  const planned = roadmapItems.filter(item => item.status === "planned" || !item.status)

  return (
    <div className="min-h-screen bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
      <MarketingHeader />

      <main className="container mx-auto px-6 py-20">
        <AnimatedSection className="space-y-12">
          <AnimatedItem className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
              Roadmap
            </h1>
            <p className="text-lg text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
              See what's coming next to Klutr. We're constantly working to bring order to your chaos.
            </p>
          </AnimatedItem>

          {roadmapItems.length === 0 ? (
            <AnimatedItem className="text-center py-12">
              <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                Roadmap items will appear here once they're added to BaseHub.
              </p>
            </AnimatedItem>
          ) : (
            <>
              {/* In Progress */}
              {inProgress.length > 0 && (
                <AnimatedItem className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-[var(--klutr-coral)]" />
                    <h2 className="text-2xl md:text-3xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                      In Progress
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {inProgress.map((item) => (
                      <Card
                        key={item._id}
                        className="border-[var(--klutr-outline)]/20 hover:border-[var(--klutr-coral)]/30 transition-colors"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <StatusIcon status={item.status} />
                            <div className="flex gap-2 flex-wrap">
                              <StatusBadge status={item.status} />
                              <PriorityBadge priority={item.priority} />
                            </div>
                          </div>
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                          {item.category && (
                            <Badge variant="outline" className="mt-2 w-fit">
                              {item.category}
                            </Badge>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {item.description && (
                            <p className="text-sm text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                              {item.description}
                            </p>
                          )}
                          {item.targetDate && (
                            <p className="text-xs text-[var(--klutr-text-primary-light)]/60 dark:text-[var(--klutr-text-primary-dark)]/60">
                              Target: {new Date(item.targetDate).toLocaleDateString()}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AnimatedItem>
              )}

              {/* Planned */}
              {planned.length > 0 && (
                <AnimatedItem className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Circle className="w-6 h-6 text-gray-400" />
                    <h2 className="text-2xl md:text-3xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                      Planned
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {planned.map((item) => (
                      <Card
                        key={item._id}
                        className="border-[var(--klutr-outline)]/20 hover:border-[var(--klutr-coral)]/30 transition-colors"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <StatusIcon status={item.status} />
                            <div className="flex gap-2 flex-wrap">
                              <StatusBadge status={item.status} />
                              <PriorityBadge priority={item.priority} />
                            </div>
                          </div>
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                          {item.category && (
                            <Badge variant="outline" className="mt-2 w-fit">
                              {item.category}
                            </Badge>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {item.description && (
                            <p className="text-sm text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                              {item.description}
                            </p>
                          )}
                          {item.targetDate && (
                            <p className="text-xs text-[var(--klutr-text-primary-light)]/60 dark:text-[var(--klutr-text-primary-dark)]/60">
                              Target: {new Date(item.targetDate).toLocaleDateString()}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AnimatedItem>
              )}

              {/* Completed */}
              {completed.length > 0 && (
                <AnimatedItem className="space-y-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <h2 className="text-2xl md:text-3xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                      Completed
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completed.map((item) => (
                      <Card
                        key={item._id}
                        className="border-[var(--klutr-outline)]/20 opacity-75"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <StatusIcon status={item.status} />
                            <StatusBadge status={item.status} />
                          </div>
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                          {item.category && (
                            <Badge variant="outline" className="mt-2 w-fit">
                              {item.category}
                            </Badge>
                          )}
                        </CardHeader>
                        <CardContent>
                          {item.description && (
                            <p className="text-sm text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                              {item.description}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AnimatedItem>
              )}
            </>
          )}
        </AnimatedSection>
      </main>

      <MarketingFooter />
    </div>
  )
}
