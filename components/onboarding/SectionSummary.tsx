"use client"

import type { ReactNode } from "react"
import { Sparkles, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSectionSummary } from "@/lib/hooks/useSectionExperience"

type Accent = "indigo" | "lime" | "coral"

const accentToken: Record<Accent, string> = {
  indigo: "var(--color-indigo)",
  lime: "var(--color-lime)",
  coral: "var(--color-coral)",
}

interface SectionSummaryProps {
  sectionId: string
  title: string
  description: string
  highlights?: ReactNode[]
  onStartTour?: () => void
  tourCompleted?: boolean
  accent?: Accent
  className?: string
  startLabel?: string
}

export function SectionSummary({
  sectionId,
  title,
  description,
  highlights,
  onStartTour,
  tourCompleted,
  accent = "indigo",
  className,
  startLabel = "Start walkthrough",
}: SectionSummaryProps) {
  const { expanded, toggle } = useSectionSummary(sectionId)
  const accentColor = accentToken[accent]

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-l-4 border-border/60 bg-background/80 shadow-sm",
        "supports-[backdrop-filter]:backdrop-blur supports-[backdrop-filter]:backdrop-saturate-150",
        className,
      )}
      style={{ borderColor: accentColor }}
      data-section-summary
    >
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-wide" style={{ color: accentColor }}>
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {title}
            {tourCompleted && (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                Walkthrough done
              </span>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 gap-1 text-muted-foreground"
            onClick={toggle}
            aria-expanded={expanded}
          >
            {expanded ? (
              <>
                Hide
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              </>
            ) : (
              <>
                Show
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </Button>
        </div>

        {expanded && (
          <div className="space-y-4 text-sm text-muted-foreground">
            <p className="leading-relaxed">{description}</p>

            {highlights && highlights.length > 0 && (
              <ul className="grid gap-2 text-sm sm:grid-cols-2">
                {highlights.map((highlight, index) => (
                  <li key={index} className="flex gap-2 rounded-md border border-muted/60 bg-muted/30 p-3">
                    <span
                      className="mt-0.5 inline-flex h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: accentColor }}
                      aria-hidden="true"
                    />
                    <span className="leading-relaxed text-muted-foreground/90">{highlight}</span>
                  </li>
                ))}
              </ul>
            )}

            {onStartTour && (
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  className="bg-[var(--color-coral)] text-white shadow hover:opacity-90"
                  onClick={() => onStartTour()}
                >
                  {startLabel}
                </Button>
                <span className="text-xs text-muted-foreground">
                  3 quick beats to get comfy.
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
