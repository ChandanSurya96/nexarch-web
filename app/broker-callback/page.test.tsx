import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api";

const { apiFetch, replace } = vi.hoisted(() => ({
  apiFetch: vi.fn(),
  replace: vi.fn(),
}));

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return { ...actual, apiFetch };
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

const mockUseAuth = vi.fn();
vi.mock("@/lib/auth/AuthProvider", () => ({
  useAuth: () => mockUseAuth(),
}));

import BrokerCallbackPage from "@/app/broker-callback/page";
import { PENDING_BROKER_NAME_KEY } from "@/lib/hooks/useInitBrokerConnection";

function setUrl(search: string) {
  window.history.replaceState({}, "", `/broker-callback${search}`);
}

describe("BrokerCallbackPage", () => {
  beforeEach(() => {
    apiFetch.mockReset();
    replace.mockReset();
    sessionStorage.clear();
    mockUseAuth.mockReturnValue({ user: { id: "u1", username: "test" }, isLoading: false });
  });

  it("waits for auth to finish loading before calling the callback endpoint", () => {
    mockUseAuth.mockReturnValue({ user: null, isLoading: true });
    setUrl("?code=abc123&state=xyz789");

    render(<BrokerCallbackPage />);

    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("calls the callback endpoint with the stashed broker name and redirects on success", async () => {
    apiFetch.mockResolvedValue({ id: "conn1", status: "active" });
    sessionStorage.setItem(PENDING_BROKER_NAME_KEY, "upstox");
    setUrl("?code=abc123&state=xyz789");

    render(<BrokerCallbackPage />);

    await waitFor(() =>
      expect(apiFetch).toHaveBeenCalledWith("/broker-connections/callback", {
        method: "POST",
        body: JSON.stringify({ broker_name: "upstox", auth_code: "abc123", state: "xyz789" }),
      })
    );
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/profile"));
  });

  it("shows the backend's error message when the callback fails", async () => {
    apiFetch.mockRejectedValue(
      new ApiError("BROKER_AUTH_FAILED", "The broker rejected this code.", 400)
    );
    setUrl("?code=abc123&state=xyz789");

    render(<BrokerCallbackPage />);

    expect(await screen.findByText("The broker rejected this code.")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("shows an error when the broker didn't return a code", async () => {
    setUrl("");

    render(<BrokerCallbackPage />);

    expect(await screen.findByText(/didn.t return an authorization code/i)).toBeInTheDocument();
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("shows an error when the broker returned a code but no state", async () => {
    setUrl("?code=abc123");

    render(<BrokerCallbackPage />);

    expect(await screen.findByText(/didn.t return an authorization code/i)).toBeInTheDocument();
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("shows a session-expired message when auth resolves with no user", async () => {
    mockUseAuth.mockReturnValue({ user: null, isLoading: false });
    setUrl("?code=abc123&state=xyz789");

    render(<BrokerCallbackPage />);

    expect(await screen.findByText(/session expired while connecting/i)).toBeInTheDocument();
  });
});
