/**
 * Wire/domain shapes for GET /portfolios/compare?ids=a,b (Milestone 6) —
 * reuses Portfolio/PortfolioAnalytics from lib/types/portfolio.ts rather
 * than redefining them, same convention as PortfolioProfile.
 */

import {
  Portfolio,
  PortfolioAnalytics,
  PortfolioAnalyticsResponse,
  PortfolioResponse,
  toPortfolio,
  toPortfolioAnalytics,
} from "@/lib/types/portfolio";

/** {a, b, delta} — identical wire/domain shape, no snake_case fields to convert.
 * `delta` is null whenever either side's value couldn't be honestly compared
 * (no sync yet, or not enough data — same convention as elsewhere in the API). */
export interface ScalarDiff {
  a: number | null;
  b: number | null;
  delta: number | null;
}

export type SectorAllocationDiff = Record<string, ScalarDiff>;

export interface HealthDiffResponse {
  diversification_score: ScalarDiff;
  sector_concentration_hhi: ScalarDiff;
  portfolio_age_days: ScalarDiff;
  holding_count: ScalarDiff;
  volatility: ScalarDiff;
}

export interface HealthDiff {
  diversificationScore: ScalarDiff;
  sectorConcentrationHhi: ScalarDiff;
  portfolioAgeDays: ScalarDiff;
  holdingCount: ScalarDiff;
  volatility: ScalarDiff;
}

function toHealthDiff(h: HealthDiffResponse): HealthDiff {
  return {
    diversificationScore: h.diversification_score,
    sectorConcentrationHhi: h.sector_concentration_hhi,
    portfolioAgeDays: h.portfolio_age_days,
    holdingCount: h.holding_count,
    volatility: h.volatility,
  };
}

export interface ComparisonDiffResponse {
  total_value: ScalarDiff;
  sector_allocation: SectorAllocationDiff;
  health: HealthDiffResponse;
}

export interface ComparisonDiff {
  totalValue: ScalarDiff;
  sectorAllocation: SectorAllocationDiff;
  health: HealthDiff;
}

function toComparisonDiff(d: ComparisonDiffResponse): ComparisonDiff {
  return {
    totalValue: d.total_value,
    sectorAllocation: d.sector_allocation,
    health: toHealthDiff(d.health),
  };
}

export interface PortfolioComparisonEntryResponse {
  portfolio: PortfolioResponse;
  analytics: PortfolioAnalyticsResponse;
}

export interface PortfolioComparisonEntry {
  portfolio: Portfolio;
  analytics: PortfolioAnalytics;
}

export interface PortfolioComparisonResponse {
  portfolios: PortfolioComparisonEntryResponse[];
  diff: ComparisonDiffResponse;
}

export interface PortfolioComparison {
  portfolios: PortfolioComparisonEntry[];
  diff: ComparisonDiff;
}

export function toPortfolioComparison(c: PortfolioComparisonResponse): PortfolioComparison {
  return {
    portfolios: c.portfolios.map((entry) => ({
      portfolio: toPortfolio(entry.portfolio),
      analytics: toPortfolioAnalytics(entry.analytics),
    })),
    diff: toComparisonDiff(c.diff),
  };
}
