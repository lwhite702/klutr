"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  searchPlaceholder?: string;
}

export function FAQAccordion({
  items,
  searchPlaceholder = "Search",
}: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-[905px] mx-auto space-y-6">
      {/* Search Input */}
      <div className="flex justify-center mb-8">
        <div className="relative w-[237px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#707070]" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[53px] pl-12 pr-4 border border-[rgba(0,0,0,0.1)] rounded-[12px] text-base text-center text-[rgba(0,0,0,0.56)]"
          />
        </div>
      </div>

      {/* FAQ Items */}
      {filteredItems.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={cn(
              "rounded-[12px] transition-all",
              isOpen
                ? "bg-white border-4 border-[#7345B3] shadow-[8px_8px_0px_#7345B3] p-8"
                : "bg-white p-8"
            )}
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between gap-8"
            >
              <h3
                className={cn(
                  "text-2xl font-medium leading-8 text-center flex-1",
                  isOpen ? "text-[#975BEC]" : "text-black"
                )}
              >
                {item.question}
              </h3>
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                {isOpen ? (
                  <Minus className="w-8 h-8 text-black" strokeWidth={2} />
                ) : (
                  <Plus className="w-8 h-8 text-black" strokeWidth={2} />
                )}
              </div>
            </button>
            {isOpen && (
              <p className="mt-6 text-lg font-normal leading-[28px] text-black">
                {item.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
