import { NextResponse } from "next/server"
import { runNightlyStacks } from "@/cron/nightlyStacks"

export async function GET() {
  try {
    // Verify cron secret to prevent unauthorized access
    // In production, check: req.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`

    const result = await runNightlyStacks()
    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Cron nightly stacks error:", error)
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 })
  }
}
