"use client"

import { useState, useEffect } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface SectionSummaryProps {
  title: string
  description: string
  storageKey: string // Key to persist collapsed state
  defaultCollapsed?: boolean
  className?: string
}

export function SectionSummary({
  title,
  description,
  storageKey,
  defaultCollapsed = false,
  className,
}: SectionSummaryProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  useEffect(() => {
    // Load persisted state
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`sectionSummary:${storageKey}`)
      if (stored !== null) {
        setIsCollapsed(stored === "collapsed")
      }
    }
  }, [storageKey])

  const handleToggle = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    if (typeof window !== "undefined") {
      localStorage.setItem(`sectionSummary:${storageKey}`, newState ? "collapsed" : "expanded")
    }
  }

  return (
    <Collapsible open={!isCollapsed} onOpenChange={handleToggle}>
      <CollapsibleTrigger
        className={cn(
          "w-full flex items-start gap-2 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors text-left",
          className
        )}
      >
        <div className="flex-1 space-y-1">
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
        {isCollapsed ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        ) : (
          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-4 pt-2 text-sm text-muted-foreground">{description}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}
