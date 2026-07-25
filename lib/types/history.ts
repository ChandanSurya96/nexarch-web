export interface PortfolioHistoryEntryResponse {
  snapshot_date: string;
  total_value: number | null;
  diversification_score: number | null;
  volatility: number | null;
}

export interface PortfolioHistoryEntry {
  snapshotDate: string;
  totalValue: number | null;
  diversificationScore: number | null;
  volatility: number | null;
}

export function toPortfolioHistoryEntry(e: PortfolioHistoryEntryResponse): PortfolioHistoryEntry {
  return {
    snapshotDate: e.snapshot_date,
    totalValue: e.total_value,
    diversificationScore: e.diversification_score,
    volatility: e.volatility,
  };
}
