import { NextResponse } from "next/server"
import { runNightlyCluster } from "@/cron/nightlyCluster"

export async function GET() {
  try {
    // Verify cron secret to prevent unauthorized access
    // In production, check: req.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`

    const result = await runNightlyCluster()
    return NextResponse.json(result)
  } catch (error) {
    console.error("[klutr] Cron nightly cluster error:", error)
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 })
  }
}
