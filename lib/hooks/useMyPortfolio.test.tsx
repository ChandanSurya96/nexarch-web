import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { apiFetch } = vi.hoisted(() => ({ apiFetch: vi.fn() }));

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return { ...actual, apiFetch };
});

import { useMyPortfolio } from "@/lib/hooks/useMyPortfolio";

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

const PORTFOLIO_RESPONSE = {
  id: "p1",
  portfolio_type: "verified",
  is_public: false,
  display_name: "Test",
  strategy_tags: [],
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

describe("useMyPortfolio", () => {
  beforeEach(() => {
    apiFetch.mockReset();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("fetches once and does not poll when pollWhilePending is false", async () => {
    apiFetch.mockResolvedValue(null);
    const { result } = renderHook(() => useMyPortfolio(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(apiFetch).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(10000);
    expect(apiFetch).toHaveBeenCalledTimes(1);
  });

  it("polls while pending and stops once a portfolio appears", async () => {
    apiFetch
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(PORTFOLIO_RESPONSE);

    const { result } = renderHook(() => useMyPortfolio({ pollWhilePending: true }), { wrapper });

    await waitFor(() => expect(apiFetch).toHaveBeenCalledTimes(1));

    await vi.advanceTimersByTimeAsync(3000);
    await waitFor(() => expect(apiFetch).toHaveBeenCalledTimes(2));

    await vi.advanceTimersByTimeAsync(3000);
    await waitFor(() => expect(result.current.data).not.toBeNull());
    expect(apiFetch).toHaveBeenCalledTimes(3);

    // No further polling once a portfolio has appeared.
    await vi.advanceTimersByTimeAsync(10000);
    expect(apiFetch).toHaveBeenCalledTimes(3);
  });
});
