"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { PortfolioComparisonView } from "@/components/comparison/PortfolioComparisonView";
import { EmptyState } from "@/components/ui/EmptyState";
import { usePortfolioComparison } from "@/lib/hooks/usePortfolioComparison";

function CompareContent() {
  const searchParams = useSearchParams();
  const idA = searchParams.get("a");
  const idB = searchParams.get("b");
  const canCompare = !!idA && !!idB && idA !== idB;

  const { data: comparison, isLoading, error } = usePortfolioComparison(idA, idB);

  if (!canCompare) {
    return (
      <EmptyState
        title="Pick two portfolios to compare"
        description="Visit a portfolio you'd like to compare and use its Compare link, or browse investors to find one."
        action={
          <Link href="/discover" className="text-sm text-accent hover:text-accent-hover">
            Go to Discover
          </Link>
        }
      />
    );
  }

  if (isLoading) {
    return <p className="text-sm text-text-secondary">Loading…</p>;
  }

  if (error || !comparison) {
    return <p className="text-sm text-negative">This comparison isn&apos;t available.</p>;
  }

  return <PortfolioComparisonView comparison={comparison} />;
}

/**
 * Milestone 6 — link-only entry (ADR-027): every real entry point (an
 * investor's card, a portfolio's detail page) already has both portfolio
 * ids at hand, so this page doesn't build its own picker. Direct navigation
 * without both ids just shows a guided empty state.
 */
export default function ComparePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-xl font-semibold text-text-primary">Compare Portfolios</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Objective, side-by-side portfolio health — not a ranking of who&apos;s &quot;better.&quot;
      </p>
      <div className="mt-6">
        <Suspense fallback={<p className="text-sm text-text-secondary">Loading…</p>}>
          <CompareContent />
        </Suspense>
      </div>
    </main>
  );
}
