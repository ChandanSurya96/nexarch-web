/**
 * The identity card's value timeline.
 *
 * A fixed 20-point series drawn with `preserveAspectRatio="none"` so it
 * stretches to the card's width — the design treats it as a texture of the
 * shape of a holding period, not a readable chart, which is why it carries no
 * axis or values.
 */

const POINTS = [38, 42, 35, 44, 40, 30, 36, 28, 22, 26, 20, 24, 18, 14, 12, 8, 6, 4, 8, 6];
const WIDTH = 400;
const HEIGHT = 52;

const coords = POINTS.map((p, i) => `${(i / (POINTS.length - 1)) * WIDTH},${p}`);

export function Sparkline({ gradientId = "spark-grad" }: { gradientId?: string }) {
  return (
    <svg
      width="100%"
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      className="block"
      // Decorative: the adjacent labels carry the period, and the series has
      // no values to announce.
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--l-accent)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--l-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M ${coords.join(" L ")} L ${WIDTH},${HEIGHT} L 0,${HEIGHT} Z`} fill={`url(#${gradientId})`} />
      <polyline
        points={coords.join(" ")}
        fill="none"
        stroke="var(--l-accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </svg>
  );
}
