/**
 * Wire (snake_case, matches docs/api.md) and domain (camelCase) shapes for
 * portfolio-related responses, plus mappers between them — same convention
 * as AuthProvider's MeResponse -> AuthUser mapping.
 */

export interface PortfolioResponse {
  id: string;
  portfolio_type: string;
  is_public: boolean;
  display_name: string;
  strategy_tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Portfolio {
  id: string;
  portfolioType: string;
  isPublic: boolean;
  displayName: string;
  strategyTags: string[];
  createdAt: string;
  updatedAt: string;
}

export function toPortfolio(p: PortfolioResponse): Portfolio {
  return {
    id: p.id,
    portfolioType: p.portfolio_type,
    isPublic: p.is_public,
    displayName: p.display_name,
    strategyTags: p.strategy_tags,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

export interface HoldingResponse {
  id: string;
  symbol: string;
  isin: string | null;
  exchange: string | null;
  quantity: string;
  avg_cost_price: string | null;
  sector: string | null;
  market_cap_category: string | null;
  as_of_date: string;
}

export interface HoldingItem {
  id: string;
  symbol: string;
  isin: string | null;
  exchange: string | null;
  quantity: string;
  avgCostPrice: string | null;
  sector: string | null;
  marketCapCategory: string | null;
  asOfDate: string;
}

export function toHolding(h: HoldingResponse): HoldingItem {
  return {
    id: h.id,
    symbol: h.symbol,
    isin: h.isin,
    exchange: h.exchange,
    quantity: h.quantity,
    avgCostPrice: h.avg_cost_price,
    sector: h.sector,
    marketCapCategory: h.market_cap_category,
    asOfDate: h.as_of_date,
  };
}

export interface PortfolioHealthResponse {
  diversification_score: number;
  sector_concentration_hhi: number;
  portfolio_age_days: number;
  holding_count: number;
  /** Annualized volatility (ADR-024) — null wherever there isn't enough
   * real price history to compute it honestly (e.g. no broker connection,
   * or too few data points). Never a fabricated number. */
  volatility: number | null;
  /** Trailing ~90-day value-weighted return (ADR-028) — null under the
   * same conditions as volatility. Feeds the Momentum strategy category. */
  momentum: number | null;
}

export interface PortfolioHealth {
  diversificationScore: number;
  sectorConcentrationHhi: number;
  portfolioAgeDays: number;
  holdingCount: number;
  volatility: number | null;
  momentum: number | null;
}

/** One rules-based strategy-category match (Milestone 7, ADR-028) — same
 * shape wire/domain, no snake_case fields to convert. `explanation` cites
 * the actual observed number against its threshold, descriptive only, never
 * a recommendation (docs/security.md). Only present for verified portfolios
 * with a synced snapshot — always [] for Public Investor Library entries,
 * whose tags are manually curated, not rule-derived. */
export interface StrategyCategorizationEntry {
  slug: string;
  name: string;
  explanation: string;
}

export interface PortfolioAnalyticsResponse {
  portfolio_id: string;
  total_value: number | null;
  sector_allocation: Record<string, number>;
  health: PortfolioHealthResponse | null;
  strategy_overview: string | null;
  as_of: string | null;
  strategy_categorization: StrategyCategorizationEntry[];
}

export interface PortfolioAnalytics {
  portfolioId: string;
  totalValue: number | null;
  sectorAllocation: Record<string, number>;
  health: PortfolioHealth | null;
  strategyOverview: string | null;
  asOf: string | null;
  strategyCategorization: StrategyCategorizationEntry[];
}

export function toPortfolioAnalytics(a: PortfolioAnalyticsResponse): PortfolioAnalytics {
  return {
    portfolioId: a.portfolio_id,
    totalValue: a.total_value,
    sectorAllocation: a.sector_allocation,
    health: a.health
      ? {
          diversificationScore: a.health.diversification_score,
          sectorConcentrationHhi: a.health.sector_concentration_hhi,
          portfolioAgeDays: a.health.portfolio_age_days,
          holdingCount: a.health.holding_count,
          volatility: a.health.volatility,
          momentum: a.health.momentum,
        }
      : null,
    strategyOverview: a.strategy_overview,
    asOf: a.as_of,
    strategyCategorization: a.strategy_categorization,
  };
}

export interface ActivityEntryResponse {
  from_date: string;
  to_date: string;
  sector_changes: { sector: string; before: number; after: number }[];
  holding_count_change: Record<string, unknown> | null;
  summary: string;
}

export interface ActivityEntry {
  fromDate: string;
  toDate: string;
  sectorChanges: { sector: string; before: number; after: number }[];
  holdingCountChange: Record<string, unknown> | null;
  summary: string;
}

export function toActivityEntry(a: ActivityEntryResponse): ActivityEntry {
  return {
    fromDate: a.from_date,
    toDate: a.to_date,
    sectorChanges: a.sector_changes,
    holdingCountChange: a.holding_count_change,
    summary: a.summary,
  };
}

export interface PortfolioProfileResponse {
  portfolio: PortfolioResponse;
  holdings: HoldingResponse[];
  analytics: PortfolioAnalyticsResponse;
  activity: ActivityEntryResponse[];
}

export interface PortfolioProfile {
  portfolio: Portfolio;
  holdings: HoldingItem[];
  analytics: PortfolioAnalytics;
  activity: ActivityEntry[];
}

export function toPortfolioProfile(p: PortfolioProfileResponse): PortfolioProfile {
  return {
    portfolio: toPortfolio(p.portfolio),
    holdings: p.holdings.map(toHolding),
    analytics: toPortfolioAnalytics(p.analytics),
    activity: p.activity.map(toActivityEntry),
  };
}

export interface BrokerConnectionResponse {
  id: string;
  broker_name: string;
  connection_method: string;
  status: string;
  connected_at: string;
  last_synced_at: string | null;
  token_expires_at: string | null;
}

export interface BrokerConnection {
  id: string;
  brokerName: string;
  connectionMethod: string;
  status: string;
  connectedAt: string;
  lastSyncedAt: string | null;
  tokenExpiresAt: string | null;
}

export function toBrokerConnection(c: BrokerConnectionResponse): BrokerConnection {
  return {
    id: c.id,
    brokerName: c.broker_name,
    connectionMethod: c.connection_method,
    status: c.status,
    connectedAt: c.connected_at,
    lastSyncedAt: c.last_synced_at,
    tokenExpiresAt: c.token_expires_at,
  };
}
