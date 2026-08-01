import { Metric } from "@/components/ui/Metric";
import { ScalarDiff } from "@/lib/types/comparison";

interface ComparisonStatRowProps {
  label: string;
  diff: ScalarDiff;
  format: (value: number) => string;
  /** Explains what the metric means, for the ones that aren't self-evident. */
  hint?: string;
}

function formatDelta(delta: number | null, format: (value: number) => string): string {
  if (delta === null) return "Not comparable";
  if (delta === 0) return "No difference";
  // U+2212 minus rather than a hyphen, so the sign aligns with the digits in
  // a tabular face instead of sitting high and short.
  return delta > 0 ? `+${format(delta)}` : `−${format(Math.abs(delta))}`;
}

/**
 * One row of the health-metric comparison — two values plus a plain delta.
 *
 * Deliberately no red/green judgment colouring: unlike a rising or falling
 * value over time, "higher" isn't consistently good or bad across these
 * metrics (a higher HHI is more concentrated, not "worse" in a way this
 * product ranks — ADR-007). The delta column is secondary-coloured so the two
 * portfolio columns stay the primary comparison.
 */
export function ComparisonStatRow({ label, diff, format, hint }: ComparisonStatRowProps) {
  return (
    <tr className="border-b border-border transition-colors duration-fast ease-out last:border-0 hover:bg-bg-surface-hover">
      <th scope="row" className="py-3.5 pr-4 text-left align-top">
        <span className="text-body-sm font-medium text-text-primary">{label}</span>
        {hint && <span className="mt-0.5 block text-caption text-text-tertiary">{hint}</span>}
      </th>
      <td className="px-4 py-3.5 text-right align-top">
        {diff.a !== null ? (
          <Metric value={format(diff.a)} size="sm" />
        ) : (
          <span className="text-text-tertiary">—</span>
        )}
      </td>
      <td className="px-4 py-3.5 text-right align-top">
        {diff.b !== null ? (
          <Metric value={format(diff.b)} size="sm" />
        ) : (
          <span className="text-text-tertiary">—</span>
        )}
      </td>
      <td className="py-3.5 pl-4 text-right align-top font-mono text-caption text-text-secondary">
        {formatDelta(diff.delta, format)}
      </td>
    </tr>
  );
}
