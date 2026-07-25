import { HTMLAttributes } from "react";

/** Base surface for portfolio blocks, discovery-feed items — docs/design-system.md. */
export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-lg border border-border bg-bg-surface p-6 ${className}`}
      {...props}
    />
  );
}
