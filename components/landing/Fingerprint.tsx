"use client";

import { m, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

export type Sector = { name: string; weight: number };

const STEPS = 72;

/**
 * One ring of the fingerprint, as a closed path.
 *
 * The radius at each step is the base radius plus two modulations:
 *   • the sector's deviation from an even split, shaped by a sine envelope so
 *     each sector bulges at its midpoint and returns to base at its edges;
 *   • a small ring-specific wave so no two rings trace the same curve.
 *
 * This is the design's formula verbatim — the visual is parametric in the
 * Figma source, so reproducing the maths keeps it exact at any size and costs
 * no image request.
 */
function computeRingPath(
  sectors: Sector[],
  cx: number,
  cy: number,
  baseRadius: number,
  ringIndex: number,
): string {
  const total = sectors.reduce((sum, s) => sum + s.weight, 0);
  const normalised = sectors.map((s) => s.weight / total);
  const evenShare = 1 / normalised.length;
  const points: string[] = [];

  for (let step = 0; step < STEPS; step++) {
    const norm = step / STEPS;
    const angle = norm * Math.PI * 2 - Math.PI / 2;

    // Locate this step within its sector.
    let cumulative = 0;
    let share = evenShare;
    let positionInSector = 0.5;
    for (const weight of normalised) {
      if (norm <= cumulative + weight + 1e-9) {
        positionInSector = (norm - cumulative) / weight;
        share = weight;
        break;
      }
      cumulative += weight;
    }

    const deviation = (share - evenShare) / evenShare;
    const envelope = Math.sin(Math.max(0, Math.min(1, positionInSector)) * Math.PI);
    const wave = Math.sin(ringIndex * 1.83 + step * 0.27) * baseRadius * 0.011;
    const radius = baseRadius + deviation * baseRadius * 0.13 * envelope + wave;

    const x = (cx + radius * Math.cos(angle)).toFixed(1);
    const y = (cy + radius * Math.sin(angle)).toFixed(1);
    points.push(`${step === 0 ? "M" : "L"}${x},${y}`);
  }

  return `${points.join(" ")}Z`;
}

interface FingerprintProps {
  sectors: Sector[];
  size?: number;
  numRings?: number;
  /** Announced to screen readers. The visual encodes real weights, so it is an
   *  image with meaning, not decoration. */
  label: string;
  className?: string;
}

/**
 * A portfolio's sector weights drawn as concentric contour rings.
 *
 * Rings stagger in over ~0.75s each at 60ms intervals, matching the design's
 * draw-in. Under `prefers-reduced-motion` the finished state renders
 * immediately — the shape is the information, the reveal is not.
 */
export function Fingerprint({
  sectors,
  size = 420,
  numRings = 13,
  label,
  className = "",
}: FingerprintProps) {
  const reduceMotion = useReducedMotion();
  const centre = size / 2;
  const rMin = size * 0.082;
  const rMax = size * 0.445;

  const rings = useMemo(
    () =>
      Array.from({ length: numRings }, (_, i) => ({
        d: computeRingPath(sectors, centre, centre, rMin + (i / (numRings - 1)) * (rMax - rMin), i),
        opacity: 0.1 + (i / (numRings - 1)) * 0.44,
      })),
    [sectors, centre, numRings, rMin, rMax],
  );

  const boundaries = useMemo(() => {
    const total = sectors.reduce((sum, s) => sum + s.weight, 0);
    const out: number[] = [];
    let cumulative = 0;
    for (const s of sectors) {
      out.push(cumulative);
      cumulative += s.weight / total;
    }
    return out;
  }, [sectors]);

  const top = [...sectors].sort((a, b) => b.weight - a.weight).slice(0, 3);
  const totalWeight = sectors.reduce((sum, s) => sum + s.weight, 0);
  const spoken = top
    .map((s) => `${s.name} ${Math.round((s.weight / totalWeight) * 100)}%`)
    .join(", ");

  const reveal = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.75, delay, ease: "easeOut" as const },
        };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`block overflow-visible text-l-accent ${className}`}
      role="img"
      aria-label={`${label}: ${spoken}, and others`}
    >
      <m.circle
        cx={centre} cy={centre} r={rMax + size * 0.055}
        fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2.5 8"
        style={{ opacity: 0.12 }} {...reveal(0.1)}
      />
      {rings.map((ring, i) => (
        <m.path
          key={i} d={ring.d} fill="none" stroke="currentColor"
          strokeWidth={i === numRings - 1 ? 1 : 0.75}
          strokeLinecap="round" strokeLinejoin="round"
          style={{ opacity: ring.opacity }} {...reveal(i * 0.06)}
        />
      ))}
      {boundaries.map((boundary, i) => {
        const angle = boundary * Math.PI * 2 - Math.PI / 2;
        return (
          <m.line
            key={i}
            x1={(centre + (rMin + 2) * Math.cos(angle)).toFixed(1)}
            y1={(centre + (rMin + 2) * Math.sin(angle)).toFixed(1)}
            x2={(centre + (rMax + size * 0.04) * Math.cos(angle)).toFixed(1)}
            y2={(centre + (rMax + size * 0.04) * Math.sin(angle)).toFixed(1)}
            stroke="currentColor" strokeWidth="0.5"
            style={{ opacity: 0.18 }} {...reveal(0.5)}
          />
        );
      })}
      <m.circle
        cx={centre} cy={centre} r={rMin * 0.75}
        fill="none" stroke="currentColor" strokeWidth="0.75"
        style={{ opacity: 0.55 }} {...reveal(0)}
      />
      <m.circle
        cx={centre} cy={centre} r="2.5" fill="currentColor"
        style={{ opacity: 0.95 }} {...reveal(0)}
      />
    </svg>
  );
}
