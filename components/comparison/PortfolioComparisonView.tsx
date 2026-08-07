"use client";

import { ComparisonStatRow } from "@/components/comparison/ComparisonStatRow";
import { AllocationChart } from "@/components/ui/AllocationChart";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { PageSection } from "@/components/ui/Layout";
import { PortfolioIdentityStrip } from "@/components/ui/PortfolioIdentityStrip";
import { Surface } from "@/components/ui/Surface";
import { formatCount, formatCurrency, formatDays, formatPercent, formatRatio } from "@/lib/format";
import { PortfolioComparison } from "@/lib/types/comparison";

const VERIFIED_TOOLTIP = "Verified: holdings data came from an authenticated broker connection.";
const PUBLIC_TOOLTIP =
  "Public Portfolio: an educational reconstruction from public regulatory disclosures.";

interface PortfolioComparisonViewProps {
  comparison: PortfolioComparison;
}

/**
 * Shared side-by-side rendering for GET /portfolios/compare — current-state
 * analytics plus diff only (Milestone 6). Explicit non-goal: no overlaid
 * history trend, which is materially bigger than this milestone's scope.
 *
 * The layout is symmetric on purpose. A comparison where one side is visually
 * heavier than the other reads as a verdict, and this product doesn't rank
 * portfolios (ADR-007) — both columns get identical width, type and treatment,
 * and the delta is the quietest thing on the row.
 */
export function PortfolioComparisonView({ comparison }: PortfolioComparisonViewProps) {
  const [entryA, entryB] = comparison.portfolios;
  const { health, totalValue, sectorAllocation } = comparison.diff;

  // Both sides must have allocation, or neither strip renders. A strip on one
  // side only would read as "this portfolio has no sectors" rather than "we
  // don't have that data", and an asymmetric comparison is a misleading one.
  const allocations = [entryA, entryB].map((e) => e.analytics.sectorAllocation ?? {});
  const bothHaveAllocation = allocations.every((a) => Object.keys(a).length > 0);

  // A row renders "Not comparable" when its delta is null, which happens when
  // either side is missing the figure. If that is true of every row, the table
  // carries no information at all and needs explaining rather than presenting.
  // Checked against `a`/`b` too, not just `delta`: a pair where one side has a
  // value is still worth showing, and only an entirely blank table qualifies.
  const metricDiffs = [
    totalValue,
    health.diversificationScore,
    health.sectorConcentrationHhi,
    health.portfolioAgeDays,
    health.holdingCount,
    health.volatility,
  ];
  const anyMetricComparable = metricDiffs.some(
    (d) => d.delta !== null || d.a !== null || d.b !== null,
  );

  const notableSectorDiffs = Object.entries(sectorAllocation)
    .filter(([, diff]) => diff.delta !== null && Math.abs(diff.delta) >= 0.01)
    .sort((a, b) => Math.abs(b[1].delta ?? 0) - Math.abs(a[1].delta ?? 0));

  return (
    <div>
      {/* ── Who's being compared ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[entryA, entryB].map(({ portfolio, analytics }) => {
          const isVerified = portfolio.portfolioType === "verified";
          return (
            <Surface key={portfolio.id} className="animate-rise">
              <div className="flex items-start gap-3">
                <Avatar name={portfolio.displayName} />
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-title-sm font-medium tracking-tight text-text-primary">
                    {portfolio.displayName}
                  </h2>
                  <div className="mt-1.5">
                    <Badge
                      variant={isVerified ? "verified" : "public"}
                      title={isVerified ? VERIFIED_TOOLTIP : PUBLIC_TOOLTIP}
                    >
                      {isVerified ? "Verified" : "Public Portfolio"}
                    </Badge>
                  </div>
                </div>
              </div>

              {bothHaveAllocation && (
                <div className="mt-5">
                  <PortfolioIdentityStrip
                    allocation={analytics.sectorAllocation}
                    label={`${portfolio.displayName}'s sector mix`}
                    variant="medium"
                  />
                </div>
              )}
            </Surface>
          );
        })}
      </div>

      {/* ── Metrics ───────────────────────────────────────────────────────── */}
      <PageSection title="Health & value" titleAside="Differences are shown without judgment">
        {/* Every metric reads "—  Not comparable" when neither side has
            analytics, which is the normal case for two Public Investor Library
            portfolios: analytics are computed during a broker sync and seeded
            portfolios never sync (docs/TECHNICAL_DEBT.md F4). Six empty rows
            with no explanation read as a broken feature — the same failure the
            holdings Value column had — so the reason is stated once, above the
            table. The table itself stays: it shows which metrics a comparison
            covers, which is worth seeing even when this pair can't fill them. */}
        {!anyMetricComparable && (
          <p className="mb-4 rounded-lg border border-border bg-bg-surface/40 px-4 py-3 text-body-sm leading-relaxed text-text-secondary">
            Neither of these portfolios has health metrics yet. Both are rebuilt from public
            disclosures rather than synced from a broker, and these figures are calculated during a
            sync. Compare a broker-verified portfolio to see them filled in.
          </p>
        )}
        <div className="overflow-x-auto rounded-xl border border-border">
          {/* table-fixed is load-bearing, not cosmetic: with the default
              `auto` layout the browser sizes columns by content, so the
              portfolio with the longer display name gets a wider column
              (measured 154px vs 147px) and the comparison stops being
              symmetric. Fixed layout makes the declared widths authoritative,
              so neither side can look like the one the other is measured
              against. */}
          <table className="w-full min-w-[36rem] table-fixed">
            <caption className="sr-only">
              Portfolio health and value compared between {entryA.portfolio.displayName} and{" "}
              {entryB.portfolio.displayName}
            </caption>
            <thead>
              <tr className="border-b border-border-strong bg-bg-surface">
                <th
                  scope="col"
                  className="px-4 py-3 pl-5 text-left font-mono text-caption font-medium uppercase tracking-[0.08em] text-text-tertiary"
                >
                  Metric
                </th>
                {/* Both portfolio columns share one width so neither reads as
                    the reference the other is measured against. */}
                <th
                  scope="col"
                  className="w-[22%] px-4 py-3 text-right font-mono text-caption font-medium uppercase tracking-[0.08em] text-text-secondary"
                >
                  <span className="block truncate">{entryA.portfolio.displayName}</span>
                </th>
                <th
                  scope="col"
                  className="w-[22%] px-4 py-3 text-right font-mono text-caption font-medium uppercase tracking-[0.08em] text-text-secondary"
                >
                  <span className="block truncate">{entryB.portfolio.displayName}</span>
                </th>
                <th
                  scope="col"
                  className="w-[18%] px-4 py-3 pr-5 text-right font-mono text-caption font-medium uppercase tracking-[0.08em] text-text-tertiary"
                >
                  Difference
                </th>
              </tr>
            </thead>
            <tbody className="px-5">
              <ComparisonStatRow label="Total value" diff={totalValue} format={formatCurrency} />
              <ComparisonStatRow
                label="Diversification"
                hint="0 = concentrated, 1 = evenly diversified"
                diff={health.diversificationScore}
                format={formatRatio}
              />
              <ComparisonStatRow
                label="Concentration"
                hint="Herfindahl-Hirschman sector index"
                diff={health.sectorConcentrationHhi}
                format={formatRatio}
              />
              <ComparisonStatRow
                label="Portfolio age"
                diff={health.portfolioAgeDays}
                format={formatDays}
              />
              <ComparisonStatRow label="Holdings" diff={health.holdingCount} format={formatCount} />
              <ComparisonStatRow
                label="Volatility"
                hint="Annualised, trailing year"
                diff={health.volatility}
                format={formatPercent}
              />
            </tbody>
          </table>
        </div>
      </PageSection>

      {/* ── Allocation ────────────────────────────────────────────────────── */}
      {bothHaveAllocation && (
        <PageSection title="Sector allocation">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {[entryA, entryB].map(({ portfolio, analytics }) => (
              <div key={portfolio.id}>
                <h3 className="mb-4 truncate text-body-sm font-medium text-text-secondary">
                  {portfolio.displayName}
                </h3>
                <AllocationChart
                  title={`${portfolio.displayName}'s sector allocation`}
                  allocation={analytics.sectorAllocation}
                />
              </div>
            ))}
          </div>

          {notableSectorDiffs.length > 0 && (
            <div className="mt-8 border-t border-border pt-6">
              <h3 className="text-body-sm font-medium text-text-primary">Where they differ most</h3>
              <dl className="mt-4 divide-y divide-border">
                {notableSectorDiffs.map(([sector, diff]) => (
                  <div key={sector} className="flex items-baseline justify-between gap-6 py-2.5">
                    <dt className="min-w-0 truncate text-body-sm text-text-secondary">{sector}</dt>
                    <dd className="shrink-0 font-mono text-body-sm text-text-primary">
                      {formatPercent(diff.a ?? 0)}
                      <span className="mx-2 text-text-tertiary">vs</span>
                      {formatPercent(diff.b ?? 0)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </PageSection>
      )}
    </div>
  );
}
