"use client";

import { AllocationChart } from "@/components/ui/AllocationChart";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { HistoryChart } from "@/components/ui/HistoryChart";
import { HoldingsTable } from "@/components/ui/HoldingsTable";
import { PageSection } from "@/components/ui/Layout";
import { Eyebrow, Metric, StatCard } from "@/components/ui/Metric";
import { PortfolioIdentityStrip } from "@/components/ui/PortfolioIdentityStrip";
import { Surface } from "@/components/ui/Surface";
import { formatCurrency, formatPercent, formatSignedPercent } from "@/lib/format";
import { usePortfolioHistory } from "@/lib/hooks/usePortfolioHistory";
import { PortfolioProfile } from "@/lib/types/portfolio";

const VERIFIED_TOOLTIP =
  "Verified: holdings data came from an authenticated broker connection. This is not investment advice, and not a guarantee of skill or returns.";
const PUBLIC_TOOLTIP =
  "Public Portfolio: an educational reconstruction from public regulatory disclosures — not an account this individual operates or has reviewed.";

interface PortfolioProfileViewProps {
  profile: PortfolioProfile;
  /** Only used to show the owner-only "private" indicator — non-owners
   * never receive a private portfolio's data at all (enforced server-side). */
  isOwner: boolean;
}

/**
 * The shared rendering component for both "my own profile" and "viewing
 * someone else's profile". Owner controls (connect/disconnect/visibility) and
 * the Follow button are layered around this by the page components.
 *
 * Section order is deliberate — identity, then value, then performance, then
 * allocation, then holdings, then activity. Identity leads because that is the
 * product's premise: who this portfolio *is* comes before what it's worth.
 */
export function PortfolioProfileView({ profile, isOwner }: PortfolioProfileViewProps) {
  const { portfolio, holdings, analytics, activity } = profile;
  const isVerified = portfolio.portfolioType === "verified";
  const { data: history } = usePortfolioHistory(portfolio.id);

  // Rules-based auto-categorization explanations (Milestone 7, ADR-028) —
  // always [] for Public Investor Library portfolios (manually curated tags,
  // not rule-derived), so those tags render without a tooltip.
  const explanationBySlug = new Map(
    analytics.strategyCategorization.map((c) => [c.slug, c.explanation]),
  );

  const health = analytics.health;
  const hasAllocation = Object.keys(analytics.sectorAllocation).length > 0;
  const hasHistory = !!history && history.length >= 2;
  const hasPerformance = !!health || hasHistory;

  return (
    <div>
      {/* ── 1. Identity ───────────────────────────────────────────────────── */}
      <header className="animate-rise">
        <div className="flex items-start gap-4">
          <Avatar name={portfolio.displayName} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h1 className="text-title font-semibold tracking-tight text-text-primary sm:text-display-sm">
                {portfolio.displayName}
              </h1>
              <Badge
                variant={isVerified ? "verified" : "public"}
                title={isVerified ? VERIFIED_TOOLTIP : PUBLIC_TOOLTIP}
              >
                {isVerified ? "Verified" : "Public Portfolio"}
              </Badge>
              {isOwner && !portfolio.isPublic && <Badge variant="tag">Only visible to you</Badge>}
            </div>

            {portfolio.strategyTags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {portfolio.strategyTags.map((tag) => (
                  <Badge key={tag} variant="tag" title={explanationBySlug.get(tag)}>
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {analytics.asOf && (
              <p className="mt-3 text-caption text-text-tertiary">Data as of {analytics.asOf}</p>
            )}
          </div>
        </div>

        {/* The identity strip sits with the name, not beside a chart — this
            portfolio's composition is the most identifying thing about it.
            Renders nothing when sector allocation is unavailable; it must
            never be faked from holding counts. */}
        <div className="mt-7">
          <PortfolioIdentityStrip
            allocation={analytics.sectorAllocation}
            label={`${portfolio.displayName}'s sector mix`}
            variant="medium"
          />
        </div>
      </header>

      {/* ── 2. Portfolio value ────────────────────────────────────────────── */}
      {analytics.totalValue !== null && (
        <PageSection>
          <Surface padding="lg" className="animate-rise">
            <Eyebrow>Portfolio value</Eyebrow>
            <Metric value={formatCurrency(analytics.totalValue)} size="xl" className="mt-3 block" />
            <p className="mt-3 text-caption text-text-tertiary">
              Valued at cost from the most recent sync. Not a market valuation, and not a statement
              of gain or loss.
            </p>
          </Surface>
        </PageSection>
      )}

      {/* ── 3. Performance ────────────────────────────────────────────────── */}
      {hasPerformance && (
        <PageSection
          title="Performance & health"
          titleAside="Shown separately, never combined into one score"
        >
          {health && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              <StatCard
                label="Diversification"
                value={health.diversificationScore.toFixed(2)}
                description="0 = concentrated, 1 = evenly diversified"
              />
              <StatCard
                label="Concentration"
                value={health.sectorConcentrationHhi.toFixed(2)}
                description="Herfindahl-Hirschman sector index"
              />
              <StatCard
                label="Portfolio age"
                value={`${health.portfolioAgeDays}d`}
                description="Since first synced on Nexarch"
              />
              <StatCard label="Holdings" value={String(health.holdingCount)} />
              {health.volatility !== null && (
                <StatCard
                  label="Volatility"
                  value={formatPercent(health.volatility)}
                  description="Annualised, trailing year"
                />
              )}
              {health.momentum !== null && (
                <StatCard
                  label="Momentum"
                  value={formatSignedPercent(health.momentum)}
                  description="Trailing ~90 days"
                />
              )}
            </div>
          )}

          {hasHistory && (
            <div className="mt-6">
              <HistoryChart entries={history} />
            </div>
          )}
        </PageSection>
      )}

      {/* ── 4. Allocation ─────────────────────────────────────────────────── */}
      {hasAllocation && (
        <PageSection title="Allocation">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <PortfolioIdentityStrip
              allocation={analytics.sectorAllocation}
              label={`${portfolio.displayName}'s sector mix`}
              variant="large"
            />
            <AllocationChart
              title={`${portfolio.displayName}'s sector allocation`}
              allocation={analytics.sectorAllocation}
            />
          </div>

          {analytics.strategyOverview && (
            <p className="mt-8 max-w-3xl border-t border-border pt-6 text-body leading-relaxed text-text-secondary">
              {analytics.strategyOverview}
            </p>
          )}
        </PageSection>
      )}

      {/* ── 5. Holdings ───────────────────────────────────────────────────── */}
      <PageSection
        title="Holdings"
        titleAside={`${holdings.length} ${holdings.length === 1 ? "position" : "positions"}`}
      >
        <HoldingsTable
          holdings={holdings.map((h) => ({
            id: h.id,
            symbol: h.symbol,
            exchange: h.exchange,
            quantity: h.quantity,
            avgCostPrice: h.avgCostPrice,
            sector: h.sector,
          }))}
        />
      </PageSection>

      {/* ── 6. Activity ───────────────────────────────────────────────────── */}
      {activity.length > 0 && (
        <PageSection title="Activity">
          <ul className="flex flex-col gap-2">
            {activity.map((entry) => (
              <li
                key={`${entry.fromDate}-${entry.toDate}`}
                className="rounded-xl border border-border bg-bg-surface px-4 py-3.5 text-body-sm leading-relaxed text-text-secondary"
              >
                {entry.summary}
              </li>
            ))}
          </ul>
        </PageSection>
      )}
    </div>
  );
}
