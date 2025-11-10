import { draftMode } from 'next/headers'

/**
 * Safely retrieves draft mode status.
 * Returns false if draftMode() cannot be called (e.g., during static generation).
 * 
 * This utility centralizes the error handling for draftMode() calls which
 * can only be executed during request handling, not during static page generation.
 * 
 * @returns Promise<boolean> - true if draft mode is enabled, false otherwise
 */
export async function getSafeDraftMode(): Promise<boolean> {
  try {
    const draft = await draftMode()
    return draft.isEnabled
  } catch {
    // draftMode() can only be called during request handling
    // During static generation, it will throw - use false as default
    return false
  }
}
