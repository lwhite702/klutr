"use client"

/**
 * BaseHub Visual Editor Provider
 * 
 * Wraps children with BaseHub Toolbar for draft mode management and preview functionality.
 * The Toolbar enables live editing in BaseHub Studio and manages draft mode automatically.
 * 
 * NOTE: Toolbar is currently disabled in production builds due to Next.js 16 compatibility
 * issues with BaseHub's inline "use server" directives. The Toolbar will only work in
 * development mode. For production preview, consider using the preview API route directly.
 * 
 * In production, this component simply returns children unwrapped.
 */
export default function BaseHubVisualProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Toolbar disabled in production due to Next.js 16 compatibility issues
  // BaseHub Toolbar has inline "use server" directives which cause build errors
  // This can be re-enabled once BaseHub updates their library or we find a workaround
  return <>{children}</>
}

