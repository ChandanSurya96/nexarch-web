import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { apiFetch, setAccessToken } from "@/lib/api";

function mockFetchResponse(body: unknown) {
  return {
    json: async () => body,
  } as Response;
}

describe("apiFetch CSRF header attachment (ADR-031)", () => {
  const okEnvelope = { data: { ok: true }, meta: {}, error: null };

  beforeEach(() => {
    setAccessToken(null);
    document.cookie = "csrf_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.cookie = "csrf_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  });

  it("attaches X-CSRF-TOKEN when the csrf_refresh_token cookie is present", async () => {
    document.cookie = "csrf_refresh_token=abc123";
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(mockFetchResponse(okEnvelope));

    await apiFetch("/auth/refresh", { method: "POST" });

    const [, options] = fetchSpy.mock.calls[0];
    const headers = options?.headers as Record<string, string>;
    expect(headers["X-CSRF-TOKEN"]).toBe("abc123");
  });

  it("omits X-CSRF-TOKEN when there is no csrf_refresh_token cookie", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(mockFetchResponse(okEnvelope));

    await apiFetch("/portfolios/compare?ids=a,b");

    const [, options] = fetchSpy.mock.calls[0];
    const headers = options?.headers as Record<string, string>;
    expect(headers["X-CSRF-TOKEN"]).toBeUndefined();
  });

  it("URL-decodes the cookie value", async () => {
    document.cookie = `csrf_refresh_token=${encodeURIComponent("abc/123+def")}`;
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(mockFetchResponse(okEnvelope));

    await apiFetch("/auth/refresh", { method: "POST" });

    const [, options] = fetchSpy.mock.calls[0];
    const headers = options?.headers as Record<string, string>;
    expect(headers["X-CSRF-TOKEN"]).toBe("abc/123+def");
  });
});
