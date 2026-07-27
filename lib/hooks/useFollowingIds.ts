"use client";

import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { PortfolioResponse } from "@/lib/types/portfolio";

/**
 * PortfolioSchema has no per-portfolio "am I following this" field, so
 * follow status is derived client-side from the caller's full following
 * list — fine at Phase 1 scale, and avoids a schema change this milestone
 * didn't plan for.
 *
 * GET /users/me/following is paginated (ADR-032's hardening slice); this
 * requests per_page=100, the schema's max, rather than the default 20. A
 * user following more than 100 portfolios will see "am I following this"
 * state go stale for anything past the first page — a real, documented
 * limit rather than a silent one, and one no current user is anywhere near.
 */
export function useFollowingIds(enabled = true) {
  return useQuery({
    queryKey: ["followingIds"],
    queryFn: async (): Promise<Set<string>> => {
      const data = await apiFetch<PortfolioResponse[]>("/users/me/following?per_page=100");
      return new Set(data.map((p) => p.id));
    },
    enabled,
  });
}
