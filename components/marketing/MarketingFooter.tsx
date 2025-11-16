"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Linkedin, Facebook, Twitter } from "lucide-react";

function EmailSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with email service
    console.log("Email signup:", email);
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-row items-start gap-0">
      <Input
        type="email"
        placeholder="email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-[234px] h-[62px] bg-[#FAFAFA] border-2 border-[rgba(0,0,0,0.04)] rounded-l-[12px] rounded-r-0 text-xl text-[rgba(0,0,0,0.48)] px-4"
        required
      />
      <Button
        type="submit"
        className="h-[62px] bg-[#975BEC] border-2 border-[#7345B3] rounded-r-[12px] rounded-l-0 px-8 text-white font-bold text-lg hover:bg-[#8450CE]"
      >
        Subscribe
      </Button>
    </form>
  );
}

export default function MarketingFooter() {
  return (
    <footer className="bg-white border-t border-[#D6D6D6] py-12">
      <div className="container mx-auto px-6 max-w-[1440px]">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-[var(--klutr-coral)] rounded-full flex items-center justify-center shadow-[inset_0px_0px_6px_rgba(255,255,255,0.25)]">
                <div className="w-10 h-10 bg-white rounded-full shadow-[inset_0px_5px_4px_var(--klutr-coral)]" />
              </div>
              <span className="text-[48px] font-bold leading-[60px] text-black">
                Klutr
              </span>
            </div>
            <p className="text-xl text-black/88 leading-[30px]">
              Stay organized and productive with Klutr.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-2xl mb-6 text-black">Explore</h3>
            <ul className="space-y-3 text-xl text-black">
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
                  href="/features"
                  className="hover:text-[var(--klutr-coral)] transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-[var(--klutr-coral)] transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/changelog"
                  className="hover:text-[var(--klutr-coral)] transition-colors"
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-2xl mb-6 text-black">
              Keep in touch
            </h3>
            <EmailSignup />
            <div className="mt-8">
              <h4 className="font-medium text-2xl mb-4 text-black">
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
          <div>
            <h3 className="font-medium text-2xl mb-6 text-black">Resources</h3>
            <ul className="space-y-3 text-xl text-black">
              <li>
                <Link
                  href="/help"
                  className="hover:text-[var(--klutr-coral)] transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/roadmap"
                  className="hover:text-[var(--klutr-coral)] transition-colors"
                >
                  Roadmap
                </Link>
              </li>
            </ul>
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
