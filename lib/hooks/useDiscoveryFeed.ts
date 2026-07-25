"use client";

import { useQuery } from "@tanstack/react-query";

import { apiFetchWithMeta } from "@/lib/api";
import {
  DiscoveryInvestorResponse,
  PaginationMeta,
  toInvestorCardFromDiscovery,
} from "@/lib/types/discovery";
import { InvestorCardData } from "@/lib/types/investorCard";

export type DiscoverySort = "recency" | "portfolio_age" | "alphabetical";

interface DiscoveryFeedParams {
  strategy: string | null;
  sort: DiscoverySort;
  page: number;
  perPage: number;
}

interface DiscoveryFeedResult {
  items: InvestorCardData[];
  pagination: PaginationMeta;
}

/** GET /discovery/investors — filterable, sortable, paginated. */
export function useDiscoveryFeed({ strategy, sort, page, perPage }: DiscoveryFeedParams) {
  return useQuery({
    queryKey: ["discoveryFeed", strategy, sort, page, perPage],
    queryFn: async (): Promise<DiscoveryFeedResult> => {
      const params = new URLSearchParams({
        sort,
        page: String(page),
        per_page: String(perPage),
      });
      if (strategy) params.set("strategy", strategy);

      const { data, meta } = await apiFetchWithMeta<DiscoveryInvestorResponse[]>(
        `/discovery/investors?${params.toString()}`
      );

      return {
        items: data.map(toInvestorCardFromDiscovery),
        pagination: (meta.pagination as PaginationMeta) ?? {
          page: 1,
          per_page: perPage,
          total: data.length,
          total_pages: 1,
        },
      };
    },
  });
}
