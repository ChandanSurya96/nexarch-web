"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { PageContainer } from "@/components/ui/Layout";
import { ProfileSkeleton } from "@/components/ui/Skeleton";
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
    // Renders <main id="main"> rather than a bare div: this branch is what the
    // server sends for every guarded route, so without it the global skip link
    // in app/layout.tsx points at an element that doesn't exist yet and the
    // page ships with no main landmark at all.
    return (
      <PageContainer width="default">
        <ProfileSkeleton />
        <span className="sr-only" role="status">
          Checking your session…
        </span>
      </PageContainer>
    );
  }

  return <>{children}</>;
}
