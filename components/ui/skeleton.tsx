import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// Branded shimmer skeleton with Klutr colors
function ShimmerSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-gradient-to-r from-[var(--klutr-mint)]/10 via-[var(--klutr-coral)]/10 to-[var(--klutr-mint)]/10",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        className
      )}
      {...props}
    />
  )
}

// Card skeleton for marketing content
function CardSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-2xl border border-[var(--klutr-outline)]/20 p-6 space-y-4", className)} {...props}>
      <ShimmerSkeleton className="h-6 w-3/4" />
      <ShimmerSkeleton className="h-4 w-full" />
      <ShimmerSkeleton className="h-4 w-5/6" />
    </div>
  )
}

// Note card skeleton
function NoteCardSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-xl border border-[var(--klutr-outline)]/20 p-4 space-y-3", className)} {...props}>
      <ShimmerSkeleton className="h-5 w-2/3" />
      <ShimmerSkeleton className="h-4 w-full" />
      <ShimmerSkeleton className="h-4 w-4/5" />
      <div className="flex gap-2">
        <ShimmerSkeleton className="h-6 w-16 rounded-full" />
        <ShimmerSkeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  )
}

// Grid skeleton for multiple cards
function GridSkeleton({ count = 3, Card = CardSkeleton, className, ...props }: {
  count?: number
  Card?: React.ComponentType<React.HTMLAttributes<HTMLDivElement>>
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("grid gap-4", className)} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} />
      ))}
    </div>
  )
}

export { Skeleton, ShimmerSkeleton, CardSkeleton, NoteCardSkeleton, GridSkeleton }



