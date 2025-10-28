// Client-side onboarding utilities using localStorage

const ONBOARDING_KEY = "hasSeenOnboarding"
const DEMO_MODE_KEY = "demoMode"
const TOUR_SEEN_KEY = "tourSeen"

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
