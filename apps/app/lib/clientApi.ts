// Client-side API helpers for fetch calls

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

export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new ApiError(`GET ${url} failed: ${res.statusText}`, res.status, errorData)
  }

  return res.json()
}

export async function apiPost<T>(url: string, body?: any): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new ApiError(`POST ${url} failed: ${res.statusText}`, res.status, errorData)
  }

  return res.json()
}

export async function apiPatch<T>(url: string, body?: any): Promise<T> {
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new ApiError(`PATCH ${url} failed: ${res.statusText}`, res.status, errorData)
  }

  return res.json()
}
