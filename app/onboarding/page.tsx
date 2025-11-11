import { getOnboardingSteps } from "@/lib/basehub/queries/blocks"
import { OnboardingPageClient } from "./OnboardingPageClient"
import type { Metadata } from "next"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Onboarding | Klutr",
  description: "Get started with Klutr. Learn how to capture, organize, and discover insights from your notes.",
}

export default async function OnboardingPage() {
  const data = await getOnboardingSteps()

  return <OnboardingPageClient initialData={data} />
}

