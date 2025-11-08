import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Preview mode API route for BaseHub content preview
 *
 * Usage: /api/preview?secret=YOUR_PREVIEW_SECRET
 *
 * This enables Next.js draft mode, which allows viewing unpublished
 * content from BaseHub. The secret must match BASEHUB_PREVIEW_SECRET.
 *
 * When preview mode is enabled:
 * - Next.js draft mode is activated
 * - BaseHub queries automatically use draft mode
 * - BaseHub Toolbar component becomes active (if mounted)
 * - Content editors can see live updates when editing in BaseHub Studio
 *
 * To use: Visit /api/preview?secret=YOUR_PREVIEW_SECRET to enable preview mode.
 * The BaseHub Toolbar component (mounted in the marketing layout) will
 * automatically handle draft mode management and live updates.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.BASEHUB_PREVIEW_SECRET) {
    return new NextResponse("Invalid secret", { status: 401 });
  }

  draftMode().enable();

  // Redirect to home page with preview mode enabled
  return NextResponse.redirect(new URL("/", req.url));
}
