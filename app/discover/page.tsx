"use client";

import { useState } from "react";

import { InvestorCard } from "@/components/portfolio/InvestorCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { PageContainer, PageHeader } from "@/components/ui/Layout";
import { InvestorGridSkeleton } from "@/components/ui/Skeleton";
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

  // One class function for every chip, so the selected and unselected states
  // can't drift apart as filters are added.
  function chipClass(isSelected: boolean) {
    return [
      "rounded-full border px-3 py-1.5 text-caption font-medium",
      "transition-colors duration-base ease-out",
      isSelected
        ? // Accent *wash* rather than a solid accent fill: #F5F5F7 on #6C6CF2
          // measures 3.81:1 and fails AA. This pairing is 7.19:1, and a
          // selected filter shouldn't compete visually with the page's one
          // primary action anyway.
          "border-accent-border bg-accent-soft text-accent-text"
        : "border-border text-text-secondary hover:border-border-strong hover:text-text-primary",
    ].join(" ");
  }

  return (
    <PageContainer>
      <PageHeader
        title="Discover investors"
        description="Browse verified and public portfolios by strategy, diversification and consistency — not follower count."
        actions={
          <div>
            <label htmlFor="discover-sort" className="mb-1.5 block text-caption text-text-tertiary">
              Sort by
            </label>
            <select
              id="discover-sort"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as DiscoverySort);
                setPage(1);
              }}
              className="h-10 rounded-lg border-border bg-bg-surface px-3 text-body-sm text-text-primary focus:border-accent-border focus:ring-0"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        }
      />

      {/* A labelled group, so a screen reader announces what these chips filter
          rather than reading eight unexplained buttons. aria-pressed exposes
          the selected state, which the colour change alone doesn't. */}
      <div
        className="mt-8 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter investors by strategy"
      >
        <button
          type="button"
          onClick={() => selectStrategy(null)}
          aria-pressed={strategy === null}
          className={chipClass(strategy === null)}
        >
          All
        </button>
        {categories?.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => selectStrategy(category.slug)}
            aria-pressed={strategy === category.slug}
            className={chipClass(strategy === category.slug)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {isLoading && <InvestorGridSkeleton count={6} />}

        {error && (
          <EmptyState
            title="Couldn't load the discovery feed"
            description="The request didn't complete. Refresh the page to try again."
          />
        )}

        {feed &&
          (feed.items.length === 0 ? (
            <EmptyState
              title="No investors match this filter"
              description={
                strategy
                  ? "No portfolio has been categorised under this strategy yet. Try another filter, or view all investors."
                  : "There are no public portfolios to show yet."
              }
            />
          ) : (
            <>
              {/* The cards are h3, so without this the outline jumps h1 -> h3
                  and the results have no named section to skip to. Visually
                  redundant next to the page title, hence sr-only. */}
              <h2 className="sr-only">Investors</h2>
              <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

              <div className="mt-10">
                <Pagination
                  page={page}
                  totalPages={feed.pagination.total_pages}
                  onPageChange={setPage}
                />
              </div>
            </>
          ))}
      </div>
    </PageContainer>
  );
}
