"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { getIllustrationPath, getIllustrationAltText, type IllustrationUseCase } from "@/lib/illustrations/mapping"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface EmptyStateProps {
  /**
   * Illustration use case identifier
   */
  illustration?: IllustrationUseCase
  /**
   * Custom illustration URL (overrides use case mapping)
   */
  illustrationUrl?: string
  /**
   * Illustration alt text (auto-generated if not provided)
   */
  illustrationAlt?: string
  /**
   * Title text
   */
  title: string
  /**
   * Description text
   */
  description?: string
  /**
   * Call-to-action button text
   */
  ctaText?: string
  /**
   * Call-to-action button link
   */
  ctaLink?: string
  /**
   * Custom className
   */
  className?: string
  /**
   * Illustration size (default: 'medium')
   */
  illustrationSize?: 'small' | 'medium' | 'large'
}

/**
 * EmptyState component
 * 
 * Reusable component for empty states throughout the app.
 * Supports illustrations from the UX Colors set or custom URLs.
 */
export function EmptyState({
  illustration,
  illustrationUrl,
  illustrationAlt,
  title,
  description,
  ctaText,
  ctaLink,
  className,
  illustrationSize = 'medium',
}: EmptyStateProps) {
  // Determine illustration source
  const illustrationSrc = illustrationUrl || (illustration ? getIllustrationPath(illustration) : null)
  const altText = illustrationAlt || (illustration ? getIllustrationAltText(illustration) : 'Empty state illustration')
  
  // Size classes for illustrations
  const sizeClasses = {
    small: 'w-32 h-32',
    medium: 'w-48 h-48',
    large: 'w-64 h-64',
  }

  if (!illustrationSrc) {
    return null
  }

  return (
    <Card className={cn("border-[var(--klutr-outline)]/20 rounded-2xl shadow-lg", className)}>
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <div className={cn("relative", sizeClasses[illustrationSize])}>
            <Image
              src={illustrationSrc}
              alt={altText}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 192px, 256px"
            />
          </div>
        </div>
        <CardTitle className="text-2xl font-display">{title}</CardTitle>
        {description && (
          <CardDescription className="text-base font-body">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      {ctaText && (
        <CardContent className="text-center">
          {ctaLink ? (
            <Button
              asChild
              className="bg-[var(--color-accent-mint)] hover:bg-[var(--color-accent-mint)]/90 text-[var(--color-primary)]"
            >
              <Link href={ctaLink} aria-label={ctaText}>
                {ctaText}
              </Link>
            </Button>
          ) : (
            <Button className="bg-[var(--color-accent-mint)] hover:bg-[var(--color-accent-mint)]/90 text-[var(--color-primary)]">
              {ctaText}
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  )
}

