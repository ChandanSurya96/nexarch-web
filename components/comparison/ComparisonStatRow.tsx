import { ScalarDiff } from "@/lib/types/comparison";

interface ComparisonStatRowProps {
  label: string;
  diff: ScalarDiff;
  format: (value: number) => string;
}

function formatDelta(delta: number | null, format: (value: number) => string): string {
  if (delta === null) return "Not enough data to compare";
  if (delta === 0) return "No difference";
  const prefix = delta > 0 ? "+" : "";
  return `${prefix}${format(delta)}`;
}

/**
 * One row of a health-metric comparison table — two values plus a plain
 * delta. Deliberately no red/green judgment coloring: unlike a rising/
 * falling value over time, "higher" isn't consistently good or bad across
 * these metrics (a higher HHI is more concentrated, not "worse" in a way
 * this product ranks — see ADR-007, docs/design-system.md).
 */
export function ComparisonStatRow({ label, diff, format }: ComparisonStatRowProps) {
  return (
    <tr className="border-b border-border last:border-0">
      <th scope="row" className="py-3 pr-4 text-left text-sm font-medium text-text-primary">
        {label}
      </th>
      <td className="py-3 px-4 text-right tabular-nums text-text-primary">
        {diff.a !== null ? format(diff.a) : "—"}
      </td>
      <td className="py-3 px-4 text-right tabular-nums text-text-primary">
        {diff.b !== null ? format(diff.b) : "—"}
      </td>
      <td className="py-3 pl-4 text-right text-sm tabular-nums text-text-secondary">
        {formatDelta(diff.delta, format)}
      </td>
    </tr>
  );
}
