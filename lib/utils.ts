import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = "Operation timed out",
): Promise<T> {
  let timeoutHandle: NodeJS.Timeout

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
  })

  try {
    const result = await Promise.race([promise, timeoutPromise])
    clearTimeout(timeoutHandle!)
    return result
  } catch (error) {
    clearTimeout(timeoutHandle!)
    throw error
  }
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number
    delayMs?: number
    backoff?: boolean
  } = {},
): Promise<T> {
  const { maxAttempts = 3, delayMs = 1000, backoff = true } = options
  let lastError: Error

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (attempt === maxAttempts) {
        throw lastError
      }

      const delay = backoff ? delayMs * Math.pow(2, attempt - 1) : delayMs
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}

