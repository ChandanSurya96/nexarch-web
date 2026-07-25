interface StatCardProps {
  label: string;
  value: string;
  description?: string;
}

/**
 * A single labeled metric — deliberately not styled as a score. There is no
 * single composite "trust score" in Nexarch (ADR-007); each health indicator
 * is shown and explained independently instead.
 */
export function StatCard({ label, value, description }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-bg-surface p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-text-primary">{value}</p>
      {description && <p className="mt-1 text-xs text-text-secondary">{description}</p>}
    </div>
  );
}
