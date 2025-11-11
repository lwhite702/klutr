"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link as LinkIcon } from "lucide-react"
import Link from "next/link"
import type { HelpTopicBlock as HelpTopicBlockType } from "@/lib/basehub/queries/blocks"
import { cn } from "@/lib/utils"

interface HelpTopicBlockProps {
  topic: HelpTopicBlockType
  className?: string
}

/**
 * HelpTopicBlock component
 * 
 * Renders a help topic article with title, content, tags, and related links.
 * Includes full accessibility support with ARIA roles and keyboard navigation.
 */
export function HelpTopicBlock({ topic, className }: HelpTopicBlockProps) {
  if (!topic.title) {
    return null
  }

  const articleId = `help-topic-${topic.title.toLowerCase().replace(/\s+/g, "-")}`

  return (
    <article
      id={articleId}
      role="article"
      aria-labelledby={`${articleId}-title`}
      className={cn("focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-coral", className)}
    >
      <Card className="h-full shadow-depth dark:card-depth transition-shadow hover:shadow-lg">
        <CardHeader>
          <CardTitle
            id={`${articleId}-title`}
            className="text-xl font-semibold text-[var(--color-text-primary)]"
          >
            {topic.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topic.content && (
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              {topic.content}
            </p>
          )}

          {topic.tags && topic.tags.length > 0 && (
            <div className="flex flex-wrap gap-2" role="list" aria-label="Topic tags">
              {topic.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-[var(--color-accent-mint)]/20 text-[var(--color-accent-mint)] border-[var(--color-accent-mint)]/30"
                  role="listitem"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {topic.relatedLinks && topic.relatedLinks.length > 0 && (
            <div className="pt-2 border-t border-border/50">
              <h3 className="text-sm font-semibold mb-2 text-[var(--color-text-primary)]">
                Related Links
              </h3>
              <ul className="space-y-1" role="list">
                {topic.relatedLinks.map((link, index) => (
                  <li key={index} role="listitem">
                    <Link
                      href={link.url || "#"}
                      className="text-sm text-[var(--color-accent-coral)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral focus-visible:rounded inline-flex items-center gap-1.5"
                      aria-label={`${link.text || "Related link"} (opens in new tab)`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkIcon className="w-3 h-3" aria-hidden="true" />
                      {link.text || link.url}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </article>
  )
}

