// Client-side onboarding utilities using localStorage

const ONBOARDING_KEY = "hasSeenOnboarding"
const DEMO_MODE_KEY = "demoMode"
const TOUR_SEEN_KEY = "tourSeen"

// Section-specific tour keys
const TOUR_NOTES_KEY = "tourSeen:notes"
const TOUR_MINDSTORM_KEY = "tourSeen:mindstorm"
const TOUR_STACKS_KEY = "tourSeen:stacks"
const TOUR_VAULT_KEY = "tourSeen:vault"
const TOUR_INSIGHTS_KEY = "tourSeen:insights"
const TOUR_MEMORY_KEY = "tourSeen:memory"
const TOUR_NOPE_KEY = "tourSeen:nope"

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

// Section-specific tour functions
export function hasSectionTourSeen(section: string): boolean {
  if (typeof window === "undefined") return false
  const key = getSectionTourKey(section)
  return localStorage.getItem(key) === "1"
}

export function markSectionTourSeen(section: string): void {
  if (typeof window === "undefined") return
  const key = getSectionTourKey(section)
  localStorage.setItem(key, "1")
}

function getSectionTourKey(section: string): string {
  const keys: Record<string, string> = {
    notes: TOUR_NOTES_KEY,
    mindstorm: TOUR_MINDSTORM_KEY,
    stacks: TOUR_STACKS_KEY,
    vault: TOUR_VAULT_KEY,
    insights: TOUR_INSIGHTS_KEY,
    memory: TOUR_MEMORY_KEY,
    nope: TOUR_NOPE_KEY,
  }
  return keys[section.toLowerCase()] || `tourSeen:${section}`
}
