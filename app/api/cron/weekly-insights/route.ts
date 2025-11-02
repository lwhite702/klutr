import { NextResponse } from "next/server"
import { runWeeklyInsights } from "@/cron/weeklyInsights"

export async function GET() {
  try {
    // Verify cron secret to prevent unauthorized access
    // In production, check: req.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`

    const result = await runWeeklyInsights()
    return NextResponse.json(result)
  } catch (error) {
    console.error("[klutr] Cron weekly insights error:", error)
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 })
  }
}
