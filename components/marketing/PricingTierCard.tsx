"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingTierCardProps {
  tierName: string;
  price: string;
  period?: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  featured?: boolean;
  badge?: string;
  icon?: React.ReactNode;
}

export function PricingTierCard({
  tierName,
  price,
  period = "Per month",
  features,
  ctaText,
  ctaLink,
  featured = false,
  badge,
  icon,
}: PricingTierCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col p-8 gap-10 rounded-[12px] border",
        featured
          ? "bg-[#FAFF5A] border-4 border-[#EDF500] shadow-[12px_12px_0px_#EDF500]"
          : "bg-white border border-[rgba(0,0,0,0.04)]"
      )}
    >
      {/* Icon and Tier Name */}
      <div className="flex flex-col gap-4">
        {icon && (
          <div
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center border",
              featured
                ? "bg-white border border-[rgba(0,0,0,0.05)]"
                : "bg-[rgba(151,91,236,0.08)] border border-[rgba(151,91,236,0.16)]"
            )}
          >
            {icon}
          </div>
        )}
        <h3 className="text-2xl font-medium leading-[30px] text-black">
          {tierName}
        </h3>
      </div>

      {/* Price */}
      <div className="flex flex-col gap-2">
        <div className="text-[56px] font-bold leading-[69px] text-black">
          {price}
        </div>
        {badge && (
          <div className="inline-flex items-center px-4 py-2.5 bg-[var(--klutr-coral)] rounded-[52px] w-fit">
            <span className="text-sm font-semibold text-white leading-4">
              {badge}
            </span>
          </div>
        )}
        <p className="text-xl font-normal leading-[26px] text-black">
          {period}
        </p>
      </div>

      {/* Features List */}
      <div className="flex flex-col gap-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3.5">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                featured ? "bg-[#975BEC]" : "bg-[rgba(151,91,236,0.08)]"
              )}
            >
              <Check
                className={cn(
                  "w-5 h-5",
                  featured ? "text-white" : "text-[#975BEC]"
                )}
                strokeWidth={2}
              />
            </div>
            <p className="text-lg font-normal leading-[28px] text-black">
              {feature}
            </p>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <Button
        className={cn(
          "w-full h-[53px] rounded-[52px] border-[3px] font-bold text-lg transition-all",
          featured
            ? "bg-[#975BEC] border-[#7345B3] text-white shadow-[4px_4px_0px_#7345B3] hover:shadow-[6px_6px_0px_#7345B3]"
            : "bg-white border-[#7345B3] text-[#7345B3] shadow-[4px_4px_0px_#7345B3] hover:shadow-[6px_6px_0px_#7345B3]"
        )}
        style={{
          boxShadow: featured ? "4px 4px 0px #7345B3" : "4px 4px 0px #7345B3",
        }}
        asChild
      >
        <Link href={ctaLink}>{ctaText}</Link>
      </Button>
    </div>
  );
}
