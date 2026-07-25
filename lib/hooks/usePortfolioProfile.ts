"use client";

import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import {
  PortfolioProfile,
  PortfolioProfileResponse,
  toPortfolioProfile,
} from "@/lib/types/portfolio";

/** GET /portfolios/:id/profile — holdings + analytics + activity in one fetch. */
export function usePortfolioProfile(portfolioId: string | null) {
  return useQuery({
    queryKey: ["portfolioProfile", portfolioId],
    queryFn: async (): Promise<PortfolioProfile> => {
      const data = await apiFetch<PortfolioProfileResponse>(
        `/portfolios/${portfolioId}/profile`
      );
      return toPortfolioProfile(data);
    },
    enabled: portfolioId !== null,
  });
}
