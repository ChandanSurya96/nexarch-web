"use client";

import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { PublicInvestorResponse, toInvestorCardFromPublicInvestor } from "@/lib/types/discovery";
import { InvestorCardData } from "@/lib/types/investorCard";

/** GET /public-investors — the full list; this endpoint doesn't paginate. */
export function usePublicInvestors() {
  return useQuery({
    queryKey: ["publicInvestors"],
    queryFn: async (): Promise<InvestorCardData[]> => {
      const data = await apiFetch<PublicInvestorResponse[]>("/public-investors");
      return data.map(toInvestorCardFromPublicInvestor);
    },
  });
}
