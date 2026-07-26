import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { apiFetch } = vi.hoisted(() => ({ apiFetch: vi.fn() }));

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return { ...actual, apiFetch };
});

import { usePortfolioComparison } from "@/lib/hooks/usePortfolioComparison";

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function samplePortfolio(id: string) {
  return {
    id,
    portfolio_type: "verified",
    is_public: true,
    display_name: "Investor " + id,
    strategy_tags: [],
    created_at: "2026-01-01T00:00:00+00:00",
    updated_at: "2026-07-25T00:00:00+00:00",
  };
}

function sampleAnalytics(portfolioId: string, totalValue: number) {
  return {
    portfolio_id: portfolioId,
    total_value: totalValue,
    sector_allocation: { Financials: 1.0 },
    health: {
      diversification_score: 0.0,
      sector_concentration_hhi: 1.0,
      portfolio_age_days: 10,
      holding_count: 1,
      volatility: null,
    },
    strategy_overview: null,
    as_of: "2026-07-25",
  };
}

describe("usePortfolioComparison", () => {
  beforeEach(() => {
    apiFetch.mockReset();
  });

  it("maps the response into camelCase entries", async () => {
    apiFetch.mockResolvedValue({
      portfolios: [
        { portfolio: samplePortfolio("a"), analytics: sampleAnalytics("a", 20000) },
        { portfolio: samplePortfolio("b"), analytics: sampleAnalytics("b", 25000) },
      ],
      diff: {
        total_value: { a: 20000, b: 25000, delta: 5000 },
        sector_allocation: { Financials: { a: 1.0, b: 1.0, delta: 0.0 } },
        health: {
          diversification_score: { a: 0.0, b: 0.0, delta: 0.0 },
          sector_concentration_hhi: { a: 1.0, b: 1.0, delta: 0.0 },
          portfolio_age_days: { a: 10, b: 10, delta: 0 },
          holding_count: { a: 1, b: 1, delta: 0 },
          volatility: { a: null, b: null, delta: null },
        },
      },
    });

    const { result } = renderHook(() => usePortfolioComparison("a", "b"), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.portfolios[0].portfolio.id).toBe("a");
    expect(result.current.data?.portfolios[1].analytics.totalValue).toBe(25000);
    expect(result.current.data?.diff.totalValue).toEqual({ a: 20000, b: 25000, delta: 5000 });
    expect(result.current.data?.diff.health.holdingCount).toEqual({ a: 1, b: 1, delta: 0 });
    expect(apiFetch).toHaveBeenCalledWith("/portfolios/compare?ids=a,b");
  });

  it("does not fetch when either id is missing", () => {
    renderHook(() => usePortfolioComparison(null, "b"), { wrapper });
    renderHook(() => usePortfolioComparison("a", null), { wrapper });
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("does not fetch when both ids are the same", () => {
    renderHook(() => usePortfolioComparison("a", "a"), { wrapper });
    expect(apiFetch).not.toHaveBeenCalled();
  });
});
