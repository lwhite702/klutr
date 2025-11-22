// Client-side API helpers for fetch calls
import { captureFlaggedEvent } from "@/lib/posthog/client";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

const DEFAULT_TIMEOUT = 8000

async function fetchWithTimeout(url: string, init: RequestInit, surface: string) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT)

  try {
    const response = await fetch(url, { ...init, signal: controller.signal })
    return response
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      captureFlaggedEvent("stuck_load", { url, surface, timeoutMs: DEFAULT_TIMEOUT })
      throw new ApiError(`Request timed out after ${DEFAULT_TIMEOUT}ms`, 408)
    }
    captureFlaggedEvent("silent_error", { url, surface, message: (error as Error).message })
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function apiGet<T>(url: string, surface = "apiGet"): Promise<T> {
  const res = await fetchWithTimeout(
    url,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
    surface,
  )

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    captureFlaggedEvent("silent_error", { url, surface, status: res.status })
    throw new ApiError(`GET ${url} failed: ${res.statusText}`, res.status, errorData)
  }

  return res.json()
}

export async function apiPost<T>(url: string, body?: any, surface = "apiPost"): Promise<T> {
  const res = await fetchWithTimeout(
    url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    },
    surface,
  )

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    captureFlaggedEvent("silent_error", { url, surface, status: res.status })
    throw new ApiError(`POST ${url} failed: ${res.statusText}`, res.status, errorData)
  }

  return res.json()
}

export async function apiPatch<T>(url: string, body?: any, surface = "apiPatch"): Promise<T> {
  const res = await fetchWithTimeout(
    url,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    },
    surface,
  )

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    captureFlaggedEvent("silent_error", { url, surface, status: res.status })
    throw new ApiError(`PATCH ${url} failed: ${res.statusText}`, res.status, errorData)
  }

  return res.json()
}
