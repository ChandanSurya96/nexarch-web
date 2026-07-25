"use client";

import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import {
  PortfolioHistoryEntry,
  PortfolioHistoryEntryResponse,
  toPortfolioHistoryEntry,
} from "@/lib/types/history";

/** GET /portfolios/:id/history — raw snapshot history, oldest to newest (Milestone 5). */
export function usePortfolioHistory(portfolioId: string | null) {
  return useQuery({
    queryKey: ["portfolioHistory", portfolioId],
    queryFn: async (): Promise<PortfolioHistoryEntry[]> => {
      const data = await apiFetch<PortfolioHistoryEntryResponse[]>(
        `/portfolios/${portfolioId}/history`
      );
      return data.map(toPortfolioHistoryEntry);
    },
    enabled: portfolioId !== null,
  });
}
