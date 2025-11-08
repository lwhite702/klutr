"use client"

import { Toolbar } from "basehub/next-toolbar"
import { useEffect, useState } from "react"

/**
 * BaseHub Visual Editor Provider
 * 
 * Wraps children with BaseHub Toolbar for draft mode management and preview functionality.
 * The Toolbar enables live editing in BaseHub Studio and manages draft mode automatically.
 * 
 * Only renders Toolbar in:
 * - Development mode (NODE_ENV === "development"), OR
 * - Preview mode (URL contains ?preview or draft mode is enabled)
 * 
 * In production without preview, returns children unwrapped for performance.
 */
export default function BaseHubVisualProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [shouldShowToolbar, setShouldShowToolbar] = useState(false)

  useEffect(() => {
    // Check if we should show the toolbar
    const isDevelopment = process.env.NODE_ENV === "development"
    const isPreview =
      typeof window !== "undefined" &&
      (window.location.search.includes("preview") ||
        window.location.search.includes("draft"))

    // Show toolbar in development or preview mode
    setShouldShowToolbar(isDevelopment || isPreview)
  }, [])

  return (
    <>
      {children}
      {shouldShowToolbar && <Toolbar />}
    </>
  )
}

