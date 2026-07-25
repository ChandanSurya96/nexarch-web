"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { useAuth } from "@/lib/auth/AuthProvider";

/**
 * Client-side route guard (ADR-018) — checked against the same AuthProvider
 * state the rest of the app reads, not Next.js Middleware, since validating
 * the refresh cookie needs a real call to the backend either way.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-text-secondary">Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
}
