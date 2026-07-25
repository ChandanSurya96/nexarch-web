import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { apiFetch } = vi.hoisted(() => ({ apiFetch: vi.fn() }));

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return { ...actual, apiFetch };
});

import { useUpdateVisibility } from "@/lib/hooks/useUpdateVisibility";

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe("useUpdateVisibility", () => {
  beforeEach(() => {
    apiFetch.mockReset();
  });

  it("PATCHes the portfolio with the requested is_public value", async () => {
    apiFetch.mockResolvedValue(null);
    const { result } = renderHook(() => useUpdateVisibility("portfolio-1"), { wrapper });

    result.current.mutate(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(apiFetch).toHaveBeenCalledWith("/portfolios/portfolio-1", {
      method: "PATCH",
      body: JSON.stringify({ is_public: true }),
    });
  });

  it("propagates failure so the caller can show an error", async () => {
    apiFetch.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useUpdateVisibility("portfolio-1"), { wrapper });

    result.current.mutate(false);

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
