"use client";

import { ShimmerSkeleton } from "@/components/ui/skeleton";

export function StreamSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex gap-4"
          style={{
            justifyContent: i % 2 === 0 ? "flex-end" : "flex-start",
          }}
        >
          <ShimmerSkeleton
            className="rounded-2xl px-4 py-3 max-w-[80%] h-[60px]"
          />
        </div>
      ))}
    </div>
  );
}

