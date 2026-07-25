"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Card } from "@/components/ui/Card";
import { ApiError, apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth/AuthProvider";
import { PENDING_BROKER_NAME_KEY } from "@/lib/hooks/useInitBrokerConnection";

type Status = "processing" | "error";

/**
 * The broker redirects the whole browser tab back here after its own login
 * page — a full page load, not client-side routing. That tears down and
 * reloads this app's JS, so AuthProvider's in-memory access token is gone
 * until its own mount-time silent refresh (ADR-017) completes; this effect
 * waits for that before calling the callback endpoint.
 */
export default function BrokerCallbackPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [status, setStatus] = useState<Status>("processing");
  const [error, setError] = useState<string | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (isLoading || hasRun.current) return;

    if (!user) {
      setStatus("error");
      setError("Your session expired while connecting. Please log in and try again.");
      return;
    }

    hasRun.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const brokerName = sessionStorage.getItem(PENDING_BROKER_NAME_KEY) ?? "upstox";
    sessionStorage.removeItem(PENDING_BROKER_NAME_KEY);

    if (!code || !state) {
      setStatus("error");
      setError("The broker didn't return an authorization code. You can try connecting again.");
      return;
    }

    (async () => {
      try {
        await apiFetch("/broker-connections/callback", {
          method: "POST",
          body: JSON.stringify({ broker_name: brokerName, auth_code: code, state }),
        });
        router.replace("/profile");
      } catch (err) {
        setStatus("error");
        setError(
          err instanceof ApiError ? err.message : "Something went wrong connecting your broker."
        );
      }
    })();
  }, [isLoading, user, router]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm text-center">
        {status === "processing" ? (
          <p className="text-sm text-text-secondary">Connecting your broker…</p>
        ) : (
          <>
            <p className="text-sm text-negative">{error}</p>
            <a
              href="/profile"
              className="mt-4 inline-block text-sm text-accent hover:text-accent-hover"
            >
              Back to profile
            </a>
          </>
        )}
      </Card>
    </main>
  );
}
