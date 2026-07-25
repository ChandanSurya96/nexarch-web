import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { apiFetchWithMeta } = vi.hoisted(() => ({ apiFetchWithMeta: vi.fn() }));

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return { ...actual, apiFetchWithMeta };
});

import { useDiscoveryFeed } from "@/lib/hooks/useDiscoveryFeed";

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

const DISCOVERY_RESPONSE = {
  data: [
    {
      id: "p1",
      portfolio_type: "verified",
      is_public: true,
      display_name: "Rohan Mehta",
      strategy_tags: ["long-term"],
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
      health: {
        diversification_score: 0.8,
        sector_concentration_hhi: 0.2,
        portfolio_age_days: 100,
        holding_count: 10,
      },
    },
  ],
  meta: { pagination: { page: 1, per_page: 12, total: 1, total_pages: 1 } },
};

describe("useDiscoveryFeed", () => {
  beforeEach(() => {
    apiFetchWithMeta.mockReset();
  });

  it("omits the strategy param when none is selected", async () => {
    apiFetchWithMeta.mockResolvedValue(DISCOVERY_RESPONSE);
    const { result } = renderHook(
      () => useDiscoveryFeed({ strategy: null, sort: "recency", page: 1, perPage: 12 }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const [url] = apiFetchWithMeta.mock.calls[0];
    expect(url).toContain("sort=recency");
    expect(url).toContain("page=1");
    expect(url).toContain("per_page=12");
    expect(url).not.toContain("strategy=");
  });

  it("includes the strategy param when one is selected", async () => {
    apiFetchWithMeta.mockResolvedValue(DISCOVERY_RESPONSE);
    const { result } = renderHook(
      () => useDiscoveryFeed({ strategy: "value", sort: "alphabetical", page: 2, perPage: 12 }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const [url] = apiFetchWithMeta.mock.calls[0];
    expect(url).toContain("strategy=value");
    expect(url).toContain("sort=alphabetical");
    expect(url).toContain("page=2");
  });

  it("maps the response into InvestorCardData plus pagination", async () => {
    apiFetchWithMeta.mockResolvedValue(DISCOVERY_RESPONSE);
    const { result } = renderHook(
      () => useDiscoveryFeed({ strategy: null, sort: "recency", page: 1, perPage: 12 }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items).toEqual([
      {
        portfolioId: "p1",
        displayName: "Rohan Mehta",
        portfolioType: "verified",
        strategyTags: ["long-term"],
        diversificationScore: 0.8,
        bio: null,
        lastDisclosureUpdate: null,
      },
    ]);
    expect(result.current.data?.pagination).toEqual({
      page: 1,
      per_page: 12,
      total: 1,
      total_pages: 1,
    });
  });
});
