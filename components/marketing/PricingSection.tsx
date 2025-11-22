"use client"

import { useState } from "react"
import { PricingTierCard } from "./PricingTierCard"
import { BillingToggle } from "./BillingToggle"
import { Lightbulb, Users, Rocket } from "lucide-react"
import { teamsEnabled } from "@/lib/runtimeFlags"

const pricingTiers = {
  monthly: [
    {
      tierName: "Free Beta",
      price: "$0",
      period: "Forever",
      features: [
        "Unlimited notes",
        "AI organization",
        "Basic clustering",
        "Attachment uploads",
        "7-day retention",
      ],
      ctaText: "Get Started",
      ctaLink: "/signup",
      icon: <Lightbulb className="w-7 h-7 text-[#975BEC]" />,
    },
    {
      tierName: "Pro",
      price: "$8",
      period: "Per month",
      features: [
        "Everything in Free Beta",
        "Advanced AI insights",
        "Priority processing",
        "Unlimited storage",
        "Extended retention",
        "Advanced clustering",
      ],
      ctaText: "Start Free Trial",
      ctaLink: "/signup",
      featured: true,
      badge: "Recommended",
      icon: <Rocket className="w-7 h-7 text-white" />,
    },
    {
      tierName: "Team",
      price: "$20",
      period: "Per user/month",
      features: [
        "Everything in Pro",
        "Collaboration features",
        "Shared boards",
        "Role-based permissions",
        "Admin dashboard",
        "Team insights",
      ],
      ctaText: "Contact Sales",
      ctaLink: "/signup",
      icon: <Users className="w-7 h-7 text-[#975BEC]" />,
    },
  ],
  yearly: [
    {
      tierName: "Free Beta",
      price: "$0",
      period: "Forever",
      features: [
        "Unlimited notes",
        "AI organization",
        "Basic clustering",
        "Attachment uploads",
        "7-day retention",
      ],
      ctaText: "Get Started",
      ctaLink: "/signup",
      icon: <Lightbulb className="w-7 h-7 text-[#975BEC]" />,
    },
    {
      tierName: "Pro",
      price: "$64",
      period: "Per year",
      features: [
        "Everything in Free Beta",
        "Advanced AI insights",
        "Priority processing",
        "Unlimited storage",
        "Extended retention",
        "Advanced clustering",
      ],
      ctaText: "Start Free Trial",
      ctaLink: "/signup",
      featured: true,
      badge: "20% Save",
      icon: <Rocket className="w-7 h-7 text-white" />,
    },
    {
      tierName: "Team",
      price: "$160",
      period: "Per user/year",
      features: [
        "Everything in Pro",
        "Collaboration features",
        "Shared boards",
        "Role-based permissions",
        "Admin dashboard",
        "Team insights",
      ],
      ctaText: "Contact Sales",
      ctaLink: "/signup",
      icon: <Users className="w-7 h-7 text-[#975BEC]" />,
    },
  ],
}

export function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly")

  const visiblePricingTiers = pricingTiers[billing].filter(
    (tier) => teamsEnabled || tier.tierName !== "Team"
  )
  const columnClass =
    visiblePricingTiers.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"

  return (
    <>
      {/* Billing Toggle */}
      <div className="flex justify-center mb-16">
        <BillingToggle
          onToggle={(newBilling) => setBilling(newBilling)}
          defaultBilling={billing}
        />
      </div>

      {/* Pricing Tiers */}
      <div className={`grid ${columnClass} gap-8 mb-24`}>
        {visiblePricingTiers.map((tier, index) => (
          <PricingTierCard key={index} {...tier} />
        ))}
      </div>
    </>
  )
}

