import { act, renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api";

const { apiFetch, setAccessToken } = vi.hoisted(() => ({
  apiFetch: vi.fn(),
  setAccessToken: vi.fn(),
}));

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return { ...actual, apiFetch, setAccessToken };
});

import { AuthProvider, useAuth } from "@/lib/auth/AuthProvider";

const ME_RESPONSE = {
  id: "user-1",
  email: "rohan@example.com",
  username: "rohan",
  display_name: "Rohan Mehta",
  bio: null,
  avatar_url: null,
  is_public: true,
};

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe("AuthProvider silent refresh on mount", () => {
  beforeEach(() => {
    apiFetch.mockReset();
    setAccessToken.mockReset();
  });

  it("restores the session when the refresh cookie is valid", async () => {
    apiFetch.mockImplementation(async (path: string) => {
      if (path === "/auth/refresh") return { access_token: "new-token" };
      if (path === "/users/me") return ME_RESPONSE;
      throw new Error(`unexpected path ${path}`);
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toEqual({
      id: "user-1",
      email: "rohan@example.com",
      username: "rohan",
      displayName: "Rohan Mehta",
      bio: null,
      avatarUrl: null,
      isPublic: true,
    });
    expect(setAccessToken).toHaveBeenCalledWith("new-token");
  });

  it("leaves the visitor signed out when there is no valid refresh cookie", async () => {
    apiFetch.mockImplementation(async (path: string) => {
      if (path === "/auth/refresh") {
        throw new ApiError("UNAUTHORIZED", "Refresh token missing or invalid.", 401);
      }
      throw new Error(`unexpected path ${path}`);
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toBeNull();
    expect(setAccessToken).toHaveBeenCalledWith(null);
  });

  it("exposes login(), which fetches the profile and updates state", async () => {
    apiFetch.mockImplementation(async (path: string) => {
      if (path === "/auth/refresh") {
        throw new ApiError("UNAUTHORIZED", "Refresh token missing or invalid.", 401);
      }
      if (path === "/auth/login") return { access_token: "login-token" };
      if (path === "/users/me") return ME_RESPONSE;
      throw new Error(`unexpected path ${path}`);
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login("rohan@example.com", "hunter2");
    });

    expect(result.current.user?.username).toBe("rohan");
    expect(setAccessToken).toHaveBeenCalledWith("login-token");
  });
});
