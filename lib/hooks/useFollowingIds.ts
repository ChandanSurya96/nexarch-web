"use client";

import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { PortfolioResponse } from "@/lib/types/portfolio";

/**
 * PortfolioSchema has no per-portfolio "am I following this" field, so
 * follow status is derived client-side from the caller's full following
 * list — fine at Phase 1 scale, and avoids a schema change this milestone
 * didn't plan for.
 */
export function useFollowingIds(enabled = true) {
  return useQuery({
    queryKey: ["followingIds"],
    queryFn: async (): Promise<Set<string>> => {
      const data = await apiFetch<PortfolioResponse[]>("/users/me/following");
      return new Set(data.map((p) => p.id));
    },
    enabled,
  });
}
