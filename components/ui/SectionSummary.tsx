"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Info } from "lucide-react"
import { Button } from "./button"
import { Card } from "./card"
import { isSectionSummaryCollapsed, setSectionSummaryCollapsed, type PageId } from "@/lib/onboarding"

interface SectionSummaryProps {
  pageId: PageId
  title: string
  description: string
  tips?: string[]
}

export function SectionSummary({ pageId, title, description, tips }: SectionSummaryProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    setIsCollapsed(isSectionSummaryCollapsed(pageId))
  }, [pageId])

  const toggleCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    setSectionSummaryCollapsed(pageId, newState)
  }

  return (
    <Card className="border-l-4 border-l-[var(--color-indigo)] bg-[var(--color-indigo)]/5">
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-0.5">
              <Info className="h-5 w-5 text-[var(--color-indigo)]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">{title}</h3>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-sm text-muted-foreground mb-2">{description}</p>
                    {tips && tips.length > 0 && (
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                        {tips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? "Expand section" : "Collapse section"}
          >
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Card>
  )
}
