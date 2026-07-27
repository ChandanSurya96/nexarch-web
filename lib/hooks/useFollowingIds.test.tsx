import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { apiFetch } = vi.hoisted(() => ({ apiFetch: vi.fn() }));

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return { ...actual, apiFetch };
});

import { useFollowingIds } from "@/lib/hooks/useFollowingIds";

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe("useFollowingIds", () => {
  beforeEach(() => {
    apiFetch.mockReset();
  });

  it("requests the paginated endpoint with per_page=100", async () => {
    apiFetch.mockResolvedValue([{ id: "p1" }, { id: "p2" }]);

    const { result } = renderHook(() => useFollowingIds(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(apiFetch).toHaveBeenCalledWith("/users/me/following?per_page=100");
    expect(result.current.data).toEqual(new Set(["p1", "p2"]));
  });

  it("does not fetch when disabled", async () => {
    renderHook(() => useFollowingIds(false), { wrapper });
    expect(apiFetch).not.toHaveBeenCalled();
  });
});
