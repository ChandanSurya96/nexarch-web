"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { PortfolioComparisonView } from "@/components/comparison/PortfolioComparisonView";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageContainer, PageHeader } from "@/components/ui/Layout";
import { ProfileSkeleton } from "@/components/ui/Skeleton";
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
        description="Open a portfolio you'd like to compare and use its Compare link, or browse investors to find one."
        action={
          <Link href="/discover">
            <Button variant="secondary">Browse investors</Button>
          </Link>
        }
      />
    );
  }

  if (isLoading) return <ProfileSkeleton />;

  if (error || !comparison) {
    return (
      <EmptyState
        title="This comparison isn't available"
        description="One of these portfolios may be private, or the link may be wrong."
        action={
          <Link href="/discover">
            <Button variant="secondary">Browse investors</Button>
          </Link>
        }
      />
    );
  }

  return <PortfolioComparisonView comparison={comparison} />;
}

/**
 * Milestone 6 — link-only entry (ADR-027): every real entry point (an
 * investor's card, a portfolio's detail page) already has both portfolio ids
 * at hand, so this page doesn't build its own picker. Direct navigation
 * without both ids shows a guided empty state.
 */
export default function ComparePage() {
  return (
    <PageContainer width="default">
      <PageHeader
        title="Compare portfolios"
        description="Side-by-side portfolio health. This is a comparison, not a ranking — neither side is presented as the better one."
      />
      <div className="mt-10">
        <Suspense fallback={<ProfileSkeleton />}>
          <CompareContent />
        </Suspense>
      </div>
    </PageContainer>
  );
}
