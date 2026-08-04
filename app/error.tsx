"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageContainer } from "@/components/ui/Layout";

/**
 * Route-level error boundary — the 500-equivalent for anything thrown while
 * rendering a page.
 *
 * Without it, an unhandled render error shows Next.js's own overlay in
 * development and a bare "Application error" in production. Neither offers a
 * way forward, and the production one is indistinguishable from the app being
 * broken outright.
 *
 * The message is deliberately generic. Server error text can carry account
 * details or upstream broker responses, so `error.message` is sent to the
 * console for a developer and never rendered — the user gets a recovery path
 * instead. `digest` is Next.js's server-side correlation id and is safe to
 * show; it is what makes a support report actionable.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sentry (ADR-041) captures this in production once a DSN is configured;
    // this keeps it visible during local development regardless.
    console.error(error);
  }, [error]);

  return (
    <PageContainer width="narrow">
      <EmptyState
        title="Something went wrong"
        description="This page couldn't be displayed. Your data is unaffected — nothing was changed."
        action={
          <div className="flex flex-col items-center gap-3">
            <Button variant="primary" onClick={reset}>
              Try again
            </Button>
            {error.digest && (
              <p className="font-mono text-caption text-text-tertiary">
                Reference: {error.digest}
              </p>
            )}
          </div>
        }
      />
    </PageContainer>
  );
}
