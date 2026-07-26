"use client";

import { AllocationChart } from "@/components/ui/AllocationChart";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ComparisonStatRow } from "@/components/comparison/ComparisonStatRow";
import { PortfolioComparison } from "@/lib/types/comparison";

const VERIFIED_TOOLTIP = "Verified: holdings data came from an authenticated broker connection.";
const PUBLIC_TOOLTIP = "Public Portfolio: an educational reconstruction from public regulatory disclosures.";

function formatRatio(v: number): string {
  return v.toFixed(2);
}
function formatPercent(v: number): string {
  return `${(v * 100).toFixed(1)}%`;
}
function formatDays(v: number): string {
  return `${v}d`;
}
function formatCount(v: number): string {
  return String(v);
}
function formatCurrency(v: number): string {
  return `₹${v.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

interface PortfolioComparisonViewProps {
  comparison: PortfolioComparison;
}

/**
 * Shared side-by-side rendering for GET /portfolios/compare — current-state
 * analytics + diff only (Milestone 6). Explicit non-goal: no overlaid
 * HistoryChart trend comparison over time — that's materially bigger than
 * this milestone's "compare two portfolios / diff visualizations" scope.
 */
export function PortfolioComparisonView({ comparison }: PortfolioComparisonViewProps) {
  const [entryA, entryB] = comparison.portfolios;
  const { health, totalValue, sectorAllocation } = comparison.diff;

  const notableSectorDiffs = Object.entries(sectorAllocation)
    .filter(([, diff]) => diff.delta !== null && Math.abs(diff.delta) >= 0.01)
    .sort((a, b) => Math.abs(b[1].delta ?? 0) - Math.abs(a[1].delta ?? 0));

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-4">
        {[entryA, entryB].map(({ portfolio }) => {
          const isVerified = portfolio.portfolioType === "verified";
          return (
            <div key={portfolio.id} className="flex items-center gap-3">
              <Avatar name={portfolio.displayName} size="lg" />
              <div className="min-w-0">
                <p className="truncate font-semibold text-text-primary">{portfolio.displayName}</p>
                <Badge
                  variant={isVerified ? "verified" : "public"}
                  title={isVerified ? VERIFIED_TOOLTIP : PUBLIC_TOOLTIP}
                >
                  {isVerified ? "Verified" : "Public Portfolio"}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-text-secondary">Portfolio Health</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="py-2 pr-4 text-left text-xs font-medium uppercase tracking-wide text-text-secondary">
                  Metric
                </th>
                <th scope="col" className="py-2 px-4 text-right text-xs font-medium uppercase tracking-wide text-text-secondary">
                  {entryA.portfolio.displayName}
                </th>
                <th scope="col" className="py-2 px-4 text-right text-xs font-medium uppercase tracking-wide text-text-secondary">
                  {entryB.portfolio.displayName}
                </th>
                <th scope="col" className="py-2 pl-4 text-right text-xs font-medium uppercase tracking-wide text-text-secondary">
                  Difference
                </th>
              </tr>
            </thead>
            <tbody>
              <ComparisonStatRow label="Total Value" diff={totalValue} format={formatCurrency} />
              <ComparisonStatRow
                label="Diversification"
                diff={health.diversificationScore}
                format={formatRatio}
              />
              <ComparisonStatRow
                label="Concentration (HHI)"
                diff={health.sectorConcentrationHhi}
                format={formatRatio}
              />
              <ComparisonStatRow label="Portfolio Age" diff={health.portfolioAgeDays} format={formatDays} />
              <ComparisonStatRow label="Holdings" diff={health.holdingCount} format={formatCount} />
              <ComparisonStatRow label="Volatility" diff={health.volatility} format={formatPercent} />
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-text-secondary">Sector Allocation</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <AllocationChart
            title={`${entryA.portfolio.displayName}'s sector allocation`}
            allocation={entryA.analytics.sectorAllocation}
          />
          <AllocationChart
            title={`${entryB.portfolio.displayName}'s sector allocation`}
            allocation={entryB.analytics.sectorAllocation}
          />
        </div>
        {notableSectorDiffs.length > 0 && (
          <ul className="mt-4 flex flex-col gap-1.5 text-sm text-text-secondary">
            {notableSectorDiffs.map(([sector, diff]) => (
              <li key={sector}>
                {sector}: {((diff.a ?? 0) * 100).toFixed(0)}% vs {((diff.b ?? 0) * 100).toFixed(0)}%
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
