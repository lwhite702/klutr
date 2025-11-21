"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Linkedin, Facebook, Twitter } from "lucide-react";

function EmailSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/marketing/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setSubmitted(true);
      setEmail("");
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex flex-row items-start gap-0">
        <Input
          type="email"
          placeholder="email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          disabled={isLoading || submitted}
          className="w-[234px] h-[62px] bg-[#FAFAFA] border-2 border-[rgba(0,0,0,0.04)] rounded-l-[12px] rounded-r-0 text-xl text-[rgba(0,0,0,0.48)] px-4 disabled:opacity-50"
          required
        />
        <Button
          type="submit"
          disabled={isLoading || submitted}
          className="h-[62px] bg-[#975BEC] border-2 border-[#7345B3] rounded-r-[12px] rounded-l-0 px-8 text-white font-bold text-lg hover:bg-[#8450CE] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "..." : submitted ? "✓" : "Subscribe"}
        </Button>
      </form>
      {submitted && (
        <p className="text-sm text-green-600">
          Thanks for subscribing! Check your email.
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function MarketingFooter() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <footer className="bg-white border-t border-[#D6D6D6] py-12">
      <div className="container mx-auto px-6 max-w-[1440px]">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Left: Logo + Description */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Image
                src={isDark ? "/logos/klutr-logo-dark.svg" : "/logos/klutr-logo-light.svg"}
                alt="Klutr"
                width={200}
                height={100}
                className="h-16 md:h-20 w-auto"
                priority
              />
            </div>
            <p className="text-lg text-black/88 leading-relaxed">
              Capture anything, let AI organize everything. Klutr turns scattered ideas into clear insights.
            </p>
          </div>
          
          {/* Center: Product, Features, Pricing, Docs, Support */}
          <div>
            <h3 className="font-medium text-xl mb-6 text-black">Links</h3>
            <ul className="space-y-3 text-lg text-black">
              <li>
                <Link
                  href="/"
                  className="hover:text-[var(--klutr-coral)] transition-colors"
                >
                  Product
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="hover:text-[var(--klutr-coral)] transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-[var(--klutr-coral)] transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href={process.env.NEXT_PUBLIC_DOCS_URL || "https://help.klutr.app"}
                  className="hover:text-[var(--klutr-coral)] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Docs
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="hover:text-[var(--klutr-coral)] transition-colors"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Right: Newsletter + Social */}
          <div>
            <h3 className="font-medium text-xl mb-6 text-black">
              Newsletter
            </h3>
            <EmailSignup />
            <div className="mt-8">
              <h4 className="font-medium text-lg mb-4 text-black">
                Follow us
              </h4>
              <div className="flex items-center gap-4">
                <Link
                  href="https://linkedin.com/company/klutr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border border-[rgba(0,0,0,0.05)] rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-6 h-6 text-black" />
                </Link>
                <Link
                  href="https://facebook.com/klutr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border border-[rgba(0,0,0,0.05)] rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-6 h-6 text-black" />
                </Link>
                <Link
                  href="https://twitter.com/klutr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border border-[rgba(0,0,0,0.05)] rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-6 h-6 text-black" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#D6D6D6] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-base text-black">
            Copyright © {new Date().getFullYear()} Klutr · All Rights Reserved
          </p>
          <div className="flex items-center gap-8">
            <Link
              href="/privacy"
              className="text-lg text-black hover:text-[var(--klutr-coral)] transition-colors"
            >
              Privacy policy
            </Link>
            <Link
              href="/terms"
              className="text-lg text-black hover:text-[var(--klutr-coral)] transition-colors"
            >
              Security
            </Link>
            <Link
              href="/terms"
              className="text-lg text-black hover:text-[var(--klutr-coral)] transition-colors"
            >
              Legal documents
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

