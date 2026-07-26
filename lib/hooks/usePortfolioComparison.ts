"use client";

import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import {
  PortfolioComparison,
  PortfolioComparisonResponse,
  toPortfolioComparison,
} from "@/lib/types/comparison";

/** GET /portfolios/compare?ids=a,b — side-by-side comparison + diff (Milestone 6). */
export function usePortfolioComparison(idA: string | null, idB: string | null) {
  const enabled = !!idA && !!idB && idA !== idB;

  return useQuery({
    queryKey: ["portfolioComparison", idA, idB],
    queryFn: async (): Promise<PortfolioComparison> => {
      const data = await apiFetch<PortfolioComparisonResponse>(
        `/portfolios/compare?ids=${idA},${idB}`
      );
      return toPortfolioComparison(data);
    },
    enabled,
  });
}
