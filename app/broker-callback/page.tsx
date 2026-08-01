"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { AuthLayout } from "@/components/ui/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
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
          body: JSON.stringify({
            broker_name: brokerName,
            auth_code: code,
            state,
          }),
        });
        router.replace("/profile");
      } catch (err) {
        setStatus("error");
        setError(
          err instanceof ApiError ? err.message : "Something went wrong connecting your broker.",
        );
      }
    })();
  }, [isLoading, user, router]);

  return (
    <AuthLayout
      title={status === "processing" ? "Connecting your broker" : "Couldn't connect your broker"}
      description={
        status === "processing"
          ? "Finishing the handshake with your broker. This takes a few seconds."
          : undefined
      }
    >
      {status === "processing" ? (
        <div className="flex flex-col gap-3" role="status" aria-live="polite">
          {/* A skeleton rather than a spinner: this step ends by revealing a
              profile, so showing the shape of what's coming is more useful
              than an abstract indicator. */}
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <span className="sr-only">Connecting your broker…</span>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <p role="alert" className="text-body-sm leading-relaxed text-negative">
            {error}
          </p>
          <Link href="/profile">
            <Button variant="secondary" size="lg" className="w-full">
              Back to your profile
            </Button>
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
