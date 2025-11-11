import { NextResponse } from "next/server"
import { runNightlyStacks } from "@/cron/nightlyStacks"

export async function GET(request: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    const expectedSecret = process.env.CRON_SECRET
    
    if (!expectedSecret) {
      console.error("[cron] CRON_SECRET not configured")
      return NextResponse.json({ error: "Cron secret not configured" }, { status: 500 })
    }
    
    if (authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await runNightlyStacks()
    return NextResponse.json(result)
  } catch (error) {
    console.error("[cron] Cron nightly stacks error:", error)
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 })
  }
}
