"use client";

export function StreamSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex gap-4 animate-pulse"
          style={{
            justifyContent: i % 2 === 0 ? "flex-end" : "flex-start",
          }}
        >
          <div
            className="rounded-2xl px-4 py-3 max-w-[80%]"
            style={{
              backgroundColor: "var(--muted)",
              height: "60px",
            }}
          />
        </div>
      ))}
    </div>
  );
}

