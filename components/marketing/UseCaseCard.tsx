"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface UseCaseCardProps {
  title: string;
  description: string;
  features: string[];
  icon?: React.ReactNode;
  ctaText?: string;
  ctaLink?: string;
}

export function UseCaseCard({
  title,
  description,
  features,
  icon,
  ctaText = "Read more",
  ctaLink = "#",
}: UseCaseCardProps) {
  return (
    <div className="bg-white rounded-[12px] p-8 space-y-6">
      {/* Header with Icon and Title */}
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-14 h-14 bg-[#975BEC] border border-[#8450CE] rounded-full flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
        <h3 className="text-[32px] font-medium leading-[40px] text-black">
          {title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-lg font-normal leading-[28px] text-black">
        {description}
      </p>

      {/* Divider */}
      <div className="w-full h-px bg-[rgba(0,0,0,0.08)]" />

      {/* Features List */}
      <div className="space-y-6">
        <div>
          <h4 className="text-[32px] font-medium leading-[34px] text-black mb-6">
            It's Help you:
          </h4>
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[rgba(151,91,236,0.08)] flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-[#975BEC]" strokeWidth={2} />
                </div>
                <p className="text-lg font-normal leading-[28px] text-black">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Button */}
      {ctaLink && (
        <Button
          className="bg-white border-[3px] border-black rounded-[52px] px-8 py-4 text-black font-bold text-lg shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#000000] transition-all"
          asChild
        >
          <Link href={ctaLink}>{ctaText}</Link>
        </Button>
      )}
    </div>
  );
}
