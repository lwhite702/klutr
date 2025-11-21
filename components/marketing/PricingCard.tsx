"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

interface PricingCardProps {
  tier: string;
  price: string;
  period?: string;
  features: string[];
  cta: string;
  ctaLink: string;
  highlighted?: boolean;
  isBeta?: boolean;
  betaBadgeText?: string;
  lifetimeDiscountNote?: string;
}

export default function PricingCard({
  tier,
  price,
  period = "month",
  features,
  cta,
  ctaLink,
  highlighted = false,
  isBeta = false,
  betaBadgeText = "Join now. Save forever.",
  lifetimeDiscountNote,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card
        className={`h-full relative ${
          highlighted
            ? "border-[var(--klutr-coral)] shadow-lg"
            : "border-[var(--klutr-outline)]/20"
        }`}
      >
        {(highlighted || isBeta) && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[var(--klutr-coral)] text-white px-4 py-1 rounded-full text-sm font-semibold">
            {isBeta ? betaBadgeText : "Most Popular"}
          </div>
        )}
        <CardHeader className="text-center space-y-4 pt-8">
          <CardTitle className="text-2xl font-bold">{tier}</CardTitle>
          <div className="space-y-1">
            <div className="text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
              {price}
            </div>
            {price !== "Free" && (
              <CardDescription className="text-sm">
                per {period}
              </CardDescription>
            )}
            {isBeta && lifetimeDiscountNote && (
              <CardDescription className="text-xs text-[var(--klutr-coral)] dark:text-[var(--klutr-coral)] font-medium pt-2">
                {lifetimeDiscountNote}
              </CardDescription>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[var(--klutr-mint)] flex-shrink-0 mt-0.5" />
                <span className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
          <Button
            className={`w-full ${
              highlighted
                ? "bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white"
                : "bg-[var(--klutr-mint)] hover:bg-[var(--klutr-mint)]/90 text-white"
            }`}
            size="lg"
            asChild
          >
            <Link href={ctaLink}>{cta}</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

