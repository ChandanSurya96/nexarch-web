"use client";

import { InvestorCard } from "@/components/portfolio/InvestorCard";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useFollowingIds } from "@/lib/hooks/useFollowingIds";
import { useMyPortfolio } from "@/lib/hooks/useMyPortfolio";
import { usePublicInvestors } from "@/lib/hooks/usePublicInvestors";

export default function LibraryPage() {
  const { user } = useAuth();
  const { data: investors, isLoading, error } = usePublicInvestors();
  const { data: followingIds } = useFollowingIds(!!user);
  const { data: myPortfolio } = useMyPortfolio({ enabled: !!user });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-xl font-semibold text-text-primary">Public Investor Library</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Educational profiles built from public shareholding disclosures — not accounts these
        investors operate or have reviewed.
      </p>

      {isLoading && <p className="mt-8 text-sm text-text-secondary">Loading…</p>}
      {error && <p className="mt-8 text-sm text-negative">Couldn&apos;t load the library.</p>}

      {investors && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {investors.map((investor) => (
            <InvestorCard
              key={investor.portfolioId}
              investor={investor}
              isFollowing={followingIds?.has(investor.portfolioId ?? "") ?? false}
              isOwnPortfolio={!!myPortfolio && investor.portfolioId === myPortfolio.id}
              viewerPortfolioId={myPortfolio?.id ?? null}
            />
          ))}
        </div>
      )}
    </main>
  );
}
