"use client";

import { InvestorCard } from "@/components/portfolio/InvestorCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageContainer, PageHeader } from "@/components/ui/Layout";
import { InvestorGridSkeleton } from "@/components/ui/Skeleton";
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
    <PageContainer>
      <PageHeader
        title="Public investor library"
        description="Educational profiles built from public shareholding disclosures — not accounts these investors operate or have reviewed."
      />

      <div className="mt-10">
        {isLoading && <InvestorGridSkeleton count={6} />}

        {error && (
          <EmptyState
            title="Couldn't load the library"
            description="The request didn't complete. Refresh the page to try again."
          />
        )}

        {investors &&
          (investors.length === 0 ? (
            <EmptyState
              title="The library is empty"
              description="Public investor profiles will appear here once they have been added."
            />
          ) : (
            <>
              {/* Cards are h3 — without this the outline jumps h1 -> h3. */}
              <h2 className="sr-only">Public investors</h2>
              <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            </>
          ))}
      </div>
    </PageContainer>
  );
}
