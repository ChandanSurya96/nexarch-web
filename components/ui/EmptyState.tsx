import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

/**
 * A fresh account with nothing synced yet is a common state, not an edge case
 * — docs/design-system.md.
 *
 * An empty screen is an invitation to act, so `title` should name what isn't
 * there and `description` should say what to do about it. The dashed border
 * distinguishes "nothing here yet" from a populated card at a glance, without
 * needing an illustration.
 */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border-strong bg-bg-surface/40 px-6 py-14 text-center">
      <p className="text-body font-medium text-text-primary">{title}</p>
      {description && (
        <p className="max-w-sm text-body-sm leading-relaxed text-text-secondary">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
