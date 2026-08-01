import { colorForSector } from "@/lib/sectorColors";

export type IdentityStripVariant = "tiny" | "medium" | "large";

interface PortfolioIdentityStripProps {
  /**
   * Sector -> weight (0–1). Pass exactly what the API returned; do not
   * synthesise, normalise from holding counts, or substitute a placeholder.
   * An empty or missing map means the strip does not render (see below).
   */
  allocation: Record<string, number> | null | undefined;
  /** Whose mix this is — becomes the accessible name, e.g. "Asha's sector mix". */
  label: string;
  variant?: IdentityStripVariant;
}

const VARIANT_HEIGHT: Record<IdentityStripVariant, string> = {
  // In a dense list or compact card, next to a name.
  tiny: "h-1",
  // Profile header and comparison columns.
  medium: "h-2.5",
  // Portfolio analytics, where the strip is the section's subject.
  large: "h-4",
};

/** How many sectors get a legend entry before the rest fold into "others". */
const LEGEND_LIMIT: Record<IdentityStripVariant, number> = {
  tiny: 0,
  medium: 4,
  large: 8,
};

/**
 * The Portfolio Identity Strip — Nexarch's signature element.
 *
 * A portfolio's sector mix drawn to scale as a single band. The premise of the
 * product is that a portfolio *is* an identity, so the thing that should be
 * instantly recognisable about someone here is the shape of what they hold,
 * not an avatar or a follower count. Rendered at one consistent colour mapping
 * everywhere it appears, it lets someone scan a page and see "concentrated in
 * financials" versus "spread across eight sectors" without reading a number.
 *
 * It is data, not decoration: every segment is a real weight, and the colours
 * come from the platform-wide sector mapping the donut chart and the holdings
 * table also use, so the three views reinforce one legend instead of teaching
 * three.
 *
 * **It renders nothing when allocation data is absent.** That is the whole
 * contract — a strip built from equal weights, holding counts, or any other
 * stand-in would assert a composition the data doesn't support, which is worse
 * than an absent element on a platform whose entire claim is that what you see
 * is what someone actually holds. Callers must not paper over the null with a
 * placeholder. The endpoints that currently cannot supply it, and the exact
 * field that would fix each, are listed in docs/design-system.md.
 */
export function PortfolioIdentityStrip({
  allocation,
  label,
  variant = "medium",
}: PortfolioIdentityStripProps) {
  const entries = Object.entries(allocation ?? {})
    .filter(([, weight]) => Number.isFinite(weight) && weight > 0)
    .sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) return null;

  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  const share = (weight: number) => weight / total;

  // The accessible name carries the composition, so the strip conveys the same
  // information to a screen reader that it conveys visually. Capped at three
  // sectors — beyond that it stops being a summary and becomes a recital.
  const spoken = entries
    .slice(0, 3)
    .map(([sector, weight]) => `${sector} ${Math.round(share(weight) * 100)}%`)
    .join(", ");
  const legendCount = LEGEND_LIMIT[variant];

  return (
    <div>
      <div
        role="img"
        aria-label={`${label}: ${spoken}${entries.length > 3 ? ", and others" : ""}`}
        className={`flex w-full overflow-hidden rounded-full bg-bg-surface-hover ${VARIANT_HEIGHT[variant]}`}
      >
        {entries.map(([sector, weight], index) => (
          <span
            key={sector}
            // flex-grow rather than width % so segments always sum to the full
            // track without rounding leaving a sliver of background showing.
            style={{
              flexGrow: weight,
              flexBasis: 0,
              backgroundColor: colorForSector(sector, index),
            }}
          />
        ))}
      </div>

      {legendCount > 0 && (
        // aria-hidden: the strip's own aria-label already says this, and a
        // screen reader shouldn't hear the same breakdown twice.
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5" aria-hidden="true">
          {entries.slice(0, legendCount).map(([sector, weight], index) => (
            <li key={sector} className="flex items-center gap-1.5 text-caption text-text-secondary">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: colorForSector(sector, index) }}
              />
              <span className="min-w-0 truncate">{sector}</span>
              <span className="font-mono text-text-tertiary">
                {Math.round(share(weight) * 100)}%
              </span>
            </li>
          ))}
          {entries.length > legendCount && (
            <li className="text-caption text-text-tertiary">
              +{entries.length - legendCount} more
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
