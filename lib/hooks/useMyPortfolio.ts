"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/api";
import { Portfolio, PortfolioResponse, toPortfolio } from "@/lib/types/portfolio";

const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 40; // ~2 minutes bounded, per ADR-020 — not indefinite

interface UseMyPortfolioOptions {
  /** Poll until a Portfolio appears (e.g. right after a broker callback). */
  pollWhilePending?: boolean;
  /**
   * Set to false on pages that render for signed-out visitors too (e.g.
   * Discover). Without this, the query fires on mount regardless of auth
   * state — on a page not gated by RequireAuth, that races AuthProvider's
   * silent-refresh-on-mount and loses, firing with no access token yet and
   * getting a 401 back. RequireAuth-gated pages (like /profile) don't need
   * this since they don't mount their children until auth has resolved.
   */
  enabled?: boolean;
}

/** GET /users/me/portfolio (ADR-019) — null is a normal "not synced yet" state. */
export function useMyPortfolio(options: UseMyPortfolioOptions = {}) {
  const { pollWhilePending = false, enabled = true } = options;
  const [pollCount, setPollCount] = useState(0);

  const query = useQuery({
    queryKey: ["myPortfolio"],
    queryFn: async (): Promise<Portfolio | null> => {
      const data = await apiFetch<PortfolioResponse | null>("/users/me/portfolio");
      return data ? toPortfolio(data) : null;
    },
    enabled,
  });

  const { data, refetch } = query;

  useEffect(() => {
    if (!pollWhilePending || data || pollCount >= MAX_POLLS) return;
    const timer = setTimeout(() => {
      setPollCount((c) => c + 1);
      refetch();
    }, POLL_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [pollWhilePending, data, pollCount, refetch]);

  return {
    ...query,
    pollExhausted: pollWhilePending && !data && pollCount >= MAX_POLLS,
  };
}
