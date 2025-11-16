"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface BillingToggleProps {
  onToggle: (billing: "monthly" | "yearly") => void;
  defaultBilling?: "monthly" | "yearly";
  showSaveBadge?: boolean;
}

export function BillingToggle({
  onToggle,
  defaultBilling = "yearly",
  showSaveBadge = true,
}: BillingToggleProps) {
  const [billing, setBilling] = useState<"monthly" | "yearly">(defaultBilling);

  const handleToggle = (newBilling: "monthly" | "yearly") => {
    setBilling(newBilling);
    onToggle(newBilling);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xl font-normal leading-[26px] text-[rgba(0,0,0,0.4)]">
        Choose your billing
      </p>
      <div className="relative">
        <div className="flex items-center bg-white border-2 border-[#7345B3] rounded-[48px] p-3 gap-3 shadow-[4px_4px_0px_#7345B3]">
          <button
            onClick={() => handleToggle("monthly")}
            className={cn(
              "px-6 py-3 rounded-[50px] text-lg font-normal transition-all",
              billing === "monthly"
                ? "bg-[#975BEC] text-white font-semibold"
                : "text-[rgba(0,0,0,0.48)] hover:text-black"
            )}
          >
            Month
          </button>
          <button
            onClick={() => handleToggle("yearly")}
            className={cn(
              "px-6 py-3 rounded-[50px] text-lg font-normal transition-all",
              billing === "yearly"
                ? "bg-[#975BEC] text-white font-semibold"
                : "text-[rgba(0,0,0,0.48)] hover:text-black"
            )}
          >
            Yearly
          </button>
        </div>
        {showSaveBadge && billing === "yearly" && (
          <div
            className="absolute -right-8 -top-2 bg-[#FFEAE5] rounded-[46px] px-4 py-1 transform rotate-[9.15deg]"
            style={{ transform: "rotate(9.15deg)" }}
          >
            <span className="text-lg font-bold text-[var(--klutr-coral)] leading-[23px]">
              20% Save
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
