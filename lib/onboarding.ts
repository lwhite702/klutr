// Client-side onboarding utilities using localStorage

const ONBOARDING_KEY = "hasSeenOnboarding"
const DEMO_MODE_KEY = "demoMode"
const TOUR_SEEN_KEY = "tourSeen"
const PAGE_TOUR_PREFIX = "pageTour_"
const SECTION_SUMMARY_PREFIX = "sectionSummary_"

// Page identifiers for tours
export type PageId = "notes" | "mindstorm" | "stacks" | "vault" | "insights" | "memory" | "nope"

export function hasSeenOnboarding(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(ONBOARDING_KEY) === "1"
}

export function markOnboardingSeen(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(ONBOARDING_KEY, "1")
}

export function isDemoMode(): boolean {
  if (typeof window === "undefined") return true // Default to demo mode on server
  const stored = localStorage.getItem(DEMO_MODE_KEY)
  return stored === null ? true : stored === "1"
}

export function enableDemoMode(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(DEMO_MODE_KEY, "1")
}

export function disableDemoMode(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(DEMO_MODE_KEY)
}

export function hasTourSeen(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(TOUR_SEEN_KEY) === "1"
}

export function markTourSeen(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(TOUR_SEEN_KEY, "1")
}

// Page-specific tour tracking
export function hasPageTourSeen(pageId: PageId): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(`${PAGE_TOUR_PREFIX}${pageId}`) === "1"
}

export function markPageTourSeen(pageId: PageId): void {
  if (typeof window === "undefined") return
  localStorage.setItem(`${PAGE_TOUR_PREFIX}${pageId}`, "1")
}

export function resetPageTour(pageId: PageId): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(`${PAGE_TOUR_PREFIX}${pageId}`)
}

// Section summary collapsed state tracking
export function isSectionSummaryCollapsed(pageId: PageId): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(`${SECTION_SUMMARY_PREFIX}${pageId}`) === "1"
}

export function setSectionSummaryCollapsed(pageId: PageId, collapsed: boolean): void {
  if (typeof window === "undefined") return
  if (collapsed) {
    localStorage.setItem(`${SECTION_SUMMARY_PREFIX}${pageId}`, "1")
  } else {
    localStorage.removeItem(`${SECTION_SUMMARY_PREFIX}${pageId}`)
  }
}
