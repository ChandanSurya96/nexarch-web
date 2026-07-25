import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { apiFetch } = vi.hoisted(() => ({ apiFetch: vi.fn() }));

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return { ...actual, apiFetch };
});

import { usePortfolioHistory } from "@/lib/hooks/usePortfolioHistory";

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe("usePortfolioHistory", () => {
  beforeEach(() => {
    apiFetch.mockReset();
  });

  it("maps the response into camelCase entries", async () => {
    apiFetch.mockResolvedValue([
      {
        snapshot_date: "2026-07-01",
        total_value: 20000,
        diversification_score: 0.5,
        volatility: null,
      },
      {
        snapshot_date: "2026-07-25",
        total_value: 25000,
        diversification_score: 0.6,
        volatility: 0.182,
      },
    ]);

    const { result } = renderHook(() => usePortfolioHistory("portfolio-1"), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([
      { snapshotDate: "2026-07-01", totalValue: 20000, diversificationScore: 0.5, volatility: null },
      { snapshotDate: "2026-07-25", totalValue: 25000, diversificationScore: 0.6, volatility: 0.182 },
    ]);
    expect(apiFetch).toHaveBeenCalledWith("/portfolios/portfolio-1/history");
  });

  it("does not fetch when portfolioId is null", () => {
    renderHook(() => usePortfolioHistory(null), { wrapper });
    expect(apiFetch).not.toHaveBeenCalled();
  });
});
