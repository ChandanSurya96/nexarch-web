import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

/** A fresh account with nothing synced yet is a common state, not an edge case — docs/design-system.md. */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-bg-surface px-6 py-12 text-center">
      <p className="text-base font-medium text-text-primary">{title}</p>
      {description && <p className="text-sm text-text-secondary">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
