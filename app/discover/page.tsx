"use client";

import { useState } from "react";

import { InvestorCard } from "@/components/portfolio/InvestorCard";
import { Pagination } from "@/components/ui/Pagination";
import { useAuth } from "@/lib/auth/AuthProvider";
import { DiscoverySort, useDiscoveryFeed } from "@/lib/hooks/useDiscoveryFeed";
import { useFollowingIds } from "@/lib/hooks/useFollowingIds";
import { useMyPortfolio } from "@/lib/hooks/useMyPortfolio";
import { useStrategyCategories } from "@/lib/hooks/useStrategyCategories";

const PER_PAGE = 12;

const SORT_OPTIONS: { value: DiscoverySort; label: string }[] = [
  { value: "recency", label: "Recently synced" },
  { value: "portfolio_age", label: "Portfolio age" },
  { value: "alphabetical", label: "Alphabetical" },
];

export default function DiscoverPage() {
  const { user } = useAuth();
  const [strategy, setStrategy] = useState<string | null>(null);
  const [sort, setSort] = useState<DiscoverySort>("recency");
  const [page, setPage] = useState(1);

  const { data: categories } = useStrategyCategories();
  const {
    data: feed,
    isLoading,
    error,
  } = useDiscoveryFeed({ strategy, sort, page, perPage: PER_PAGE });
  const { data: followingIds } = useFollowingIds(!!user);
  const { data: myPortfolio } = useMyPortfolio({ enabled: !!user });

  function selectStrategy(slug: string | null) {
    setStrategy(slug);
    setPage(1);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-xl font-semibold text-text-primary">Discover Investors</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Browse verified and public portfolios by strategy, diversification, and consistency —
        not follower count.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => selectStrategy(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              strategy === null
                ? "bg-accent text-text-primary"
                : "border border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            All
          </button>
          {categories?.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => selectStrategy(category.slug)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                strategy === category.slug
                  ? "bg-accent text-text-primary"
                  : "border border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as DiscoverySort);
            setPage(1);
          }}
          className="ml-auto rounded-md border border-border bg-bg-surface px-3 py-1.5 text-sm text-text-primary"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p className="mt-8 text-sm text-text-secondary">Loading…</p>}
      {error && <p className="mt-8 text-sm text-negative">Couldn&apos;t load the discovery feed.</p>}

      {feed && (
        <>
          {feed.items.length === 0 ? (
            <p className="mt-8 text-sm text-text-secondary">
              No investors match this filter yet.
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {feed.items.map((investor) => (
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

          <div className="mt-8">
            <Pagination
              page={page}
              totalPages={feed.pagination.total_pages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </main>
  );
}
