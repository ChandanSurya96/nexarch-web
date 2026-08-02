/**
 * The Nexarch mark — a miniature of the portfolio fingerprint.
 *
 * Five concentric rings whose radius is modulated by a sine wave, inside a
 * dashed guide circle, around a solid core. Generated rather than traced: the
 * design is parametric in the Figma source, so reproducing the formula keeps
 * it crisp at any size and costs no image request.
 */

const SIZE = 22;
const CENTRE = SIZE / 2;
const RING_COUNT = 5;
const STEPS = 48;

/** One wavy ring. `index` seeds the phase so no two rings align. */
function ringPath(index: number): string {
  const baseRadius = 3 + index * 1.8;
  const points: string[] = [];

  for (let step = 0; step < STEPS; step++) {
    const angle = (step / STEPS) * Math.PI * 2 - Math.PI / 2;
    const modulation = Math.sin(index * 1.9 + step * 0.28) * 0.5;
    const radius = baseRadius + modulation;
    const x = (CENTRE + radius * Math.cos(angle)).toFixed(1);
    const y = (CENTRE + radius * Math.sin(angle)).toFixed(1);
    points.push(`${step === 0 ? "M" : "L"}${x},${y}`);
  }

  return `${points.join(" ")}Z`;
}

const RINGS = Array.from({ length: RING_COUNT }, (_, i) => ({
  d: ringPath(i),
  opacity: 0.2 + i * 0.14,
}));

export function WordmarkGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      fill="none"
      // Decorative: the adjacent "Nexarch" text is the accessible name, so
      // announcing this too would just repeat it.
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle
        cx={CENTRE}
        cy={CENTRE}
        r={10}
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.4"
        strokeDasharray="2 5"
      />
      {RINGS.map((ring, i) => (
        <path
          key={i}
          d={ring.d}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity={ring.opacity}
        />
      ))}
      <circle cx={CENTRE} cy={CENTRE} r={1.5} fill="currentColor" opacity="0.9" />
    </svg>
  );
}

/** Mark plus wordmark, as it appears in the nav and footer. */
export function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <WordmarkGlyph className="text-l-accent" />
      <span className="font-mono text-[15px] font-medium tracking-[0.04em] text-l-text">
        Nexarch
      </span>
    </span>
  );
}
