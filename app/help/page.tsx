import { getHelpTopics } from "@/lib/basehub/queries/blocks"
import { HelpTopicBlock } from "@/app/components/blocks/HelpTopicBlock"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Suspense } from "react"
import type { Metadata } from "next"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Help & Documentation | Klutr",
  description: "Learn how to use Klutr and get the most out of your notes. Find guides, tutorials, and answers to common questions.",
}

async function HelpContent() {
  const topics = await getHelpTopics()

  if (topics.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-text-secondary)]">
          No help topics available at this time. Please check back later.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {topics.map((topic, index) => (
        <HelpTopicBlock key={index} topic={topic} />
      ))}
    </div>
  )
}

export default async function HelpPage() {
  return (
    <div className="min-h-screen bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)]">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)]">
              Help & Documentation
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              Learn how to use each feature and get the most out of your notes.
            </p>
          </div>

          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search help articles..."
              className="pl-9 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
              aria-label="Search help articles"
            />
          </div>

          <Suspense
            fallback={
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-48 bg-muted animate-pulse rounded-xl"
                    aria-hidden="true"
                  />
                ))}
              </div>
            }
          >
            <HelpContent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

