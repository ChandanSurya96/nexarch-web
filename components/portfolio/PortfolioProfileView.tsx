"use client";

import { AllocationChart } from "@/components/ui/AllocationChart";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { HistoryChart } from "@/components/ui/HistoryChart";
import { HoldingsTable } from "@/components/ui/HoldingsTable";
import { StatCard } from "@/components/ui/StatCard";
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
 * someone else's profile" — holdings, allocation, health, strategy overview,
 * activity. Owner controls (connect/disconnect/visibility) and the
 * Follow button are layered around this by the page components, not here.
 */
export function PortfolioProfileView({ profile, isOwner }: PortfolioProfileViewProps) {
  const { portfolio, holdings, analytics, activity } = profile;
  const isVerified = portfolio.portfolioType === "verified";
  const { data: history } = usePortfolioHistory(portfolio.id);

  // Rules-based auto-categorization explanations (Milestone 7, ADR-028) —
  // always [] for Public Investor Library portfolios (manually curated
  // tags, not rule-derived), so those tags simply render without a tooltip.
  const explanationBySlug = new Map(
    analytics.strategyCategorization.map((c) => [c.slug, c.explanation])
  );

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-start gap-4">
        <Avatar name={portfolio.displayName} size="lg" />
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold text-text-primary">{portfolio.displayName}</h1>
            <Badge variant={isVerified ? "verified" : "public"} title={isVerified ? VERIFIED_TOOLTIP : PUBLIC_TOOLTIP}>
              {isVerified ? "Verified" : "Public Portfolio"}
            </Badge>
            {isOwner && !portfolio.isPublic && <Badge variant="tag">Only visible to you</Badge>}
          </div>
          {portfolio.strategyTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {portfolio.strategyTags.map((tag) => (
                <Badge key={tag} variant="tag" title={explanationBySlug.get(tag)}>
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {analytics.asOf && (
            <p className="mt-2 text-xs text-text-secondary">Data as of {analytics.asOf}</p>
          )}
        </div>
      </header>

      {analytics.health && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-text-secondary">Portfolio Health</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              label="Diversification"
              value={analytics.health.diversificationScore.toFixed(2)}
              description="0 = concentrated, 1 = evenly diversified"
            />
            <StatCard
              label="Concentration (HHI)"
              value={analytics.health.sectorConcentrationHhi.toFixed(2)}
              description="Herfindahl-Hirschman sector index"
            />
            <StatCard
              label="Portfolio Age"
              value={`${analytics.health.portfolioAgeDays}d`}
              description="Since first synced on Nexarch"
            />
            <StatCard label="Holdings" value={String(analytics.health.holdingCount)} />
            {analytics.health.volatility !== null && (
              <StatCard
                label="Volatility"
                value={`${(analytics.health.volatility * 100).toFixed(1)}%`}
                description="Annualized, trailing year"
              />
            )}
            {analytics.health.momentum !== null && (
              <StatCard
                label="Momentum"
                value={`${analytics.health.momentum >= 0 ? "+" : ""}${(analytics.health.momentum * 100).toFixed(1)}%`}
                description="Trailing ~90 days"
              />
            )}
          </div>
        </section>
      )}

      {analytics.strategyOverview && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-text-secondary">Strategy Overview</h2>
          <p className="text-sm text-text-primary">{analytics.strategyOverview}</p>
        </section>
      )}

      {Object.keys(analytics.sectorAllocation).length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-text-secondary">Sector Allocation</h2>
          <AllocationChart
            title={`${portfolio.displayName}'s sector allocation`}
            allocation={analytics.sectorAllocation}
          />
        </section>
      )}

      {history && history.length >= 2 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-text-secondary">Value Over Time</h2>
          <HistoryChart entries={history} />
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold text-text-secondary">Holdings</h2>
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
      </section>

      {activity.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-text-secondary">Activity</h2>
          <ul className="flex flex-col gap-3">
            {activity.map((entry) => (
              <li
                key={`${entry.fromDate}-${entry.toDate}`}
                className="rounded-lg border border-border bg-bg-surface p-4 text-sm text-text-primary"
              >
                {entry.summary}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
