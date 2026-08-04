import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageContainer } from "@/components/ui/Layout";

export const metadata: Metadata = {
  title: "Page not found",
};

/**
 * 404. Without this file Next.js serves its own stock page — unstyled, light,
 * outside the design system, and with no way back into the product. On a
 * platform whose entire pitch is that it is careful with what it shows you,
 * a mistyped URL landing on a framework default reads as an unfinished build.
 *
 * `PageContainer` renders the `<main id="main">` the global skip link targets,
 * so this route keeps that link working like every other one.
 */
export default function NotFound() {
  return (
    <PageContainer width="narrow">
      <EmptyState
        title="This page doesn't exist"
        description="The link may be out of date, or the portfolio may have been made private since it was shared."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/discover">
              <Button variant="primary">Browse investors</Button>
            </Link>
            <Link href="/">
              <Button variant="secondary">Back to home</Button>
            </Link>
          </div>
        }
      />
    </PageContainer>
  );
}
