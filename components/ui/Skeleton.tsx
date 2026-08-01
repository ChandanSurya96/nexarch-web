interface SkeletonProps {
  className?: string;
}

/**
 * A loading placeholder shaped like the content it replaces.
 *
 * design-system.md called for skeletons from the start ("portfolio sync can
 * take a moment") but every screen shipped a bare "Loading…" text node
 * instead. A skeleton that matches the final layout keeps the page from
 * jumping when data lands, which is most of what makes loading feel calm.
 *
 * The shimmer is a masked gradient sweep rather than a pulsing opacity: on a
 * near-black background a pulse reads as flicker. Reduced-motion users get the
 * static block via the global rule in globals.css.
 */
export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-bg-surface-hover ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 -translate-x-full animate-[nx-shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
    </div>
  );
}

/**
 * The discovery/library card skeleton. Mirrors InvestorCard's real layout —
 * avatar, two text lines, fingerprint band, tag row — so the grid doesn't
 * reflow when results arrive.
 */
export function InvestorCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-bg-surface p-5">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="mt-2 h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="mt-5 h-2.5 w-full rounded-full" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}

/** A grid of card skeletons, matching the discovery feed's column counts. */
export function InvestorGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      // The live region announces the wait once; the individual blocks stay
      // aria-hidden so a screen reader isn't read a wall of empty boxes.
      role="status"
      aria-label="Loading investors"
    >
      {Array.from({ length: count }, (_, i) => (
        <InvestorCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Portfolio profile skeleton — header, stat row, chart block. */
export function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-10" role="status" aria-label="Loading portfolio">
      <div className="flex items-start gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="mt-3 h-4 w-36" />
          <Skeleton className="mt-5 h-3 w-full max-w-md rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}
