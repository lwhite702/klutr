import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

/**
 * Revalidation API route for BaseHub content updates
 * 
 * This endpoint allows triggering cache invalidation for BaseHub content.
 * The BaseHub Toolbar component uses Server Actions to automatically
 * revalidate content when changes are made in BaseHub Studio.
 * 
 * This endpoint can also be called manually or via webhooks if needed.
 * BaseHub's Toolbar component handles most revalidation automatically
 * through Next.js Server Actions.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const path = body?.path ?? "/"

    // Revalidate the specified path
    revalidatePath(path)

    return NextResponse.json({ revalidated: true, path })
  } catch (error) {
    console.error("Error revalidating path:", error)
    return NextResponse.json(
      { error: "Failed to revalidate path" },
      { status: 500 }
    )
  }
}

