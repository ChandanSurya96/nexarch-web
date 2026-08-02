"use client";

import { m, useReducedMotion } from "framer-motion";

import { Fingerprint } from "@/components/landing/Fingerprint";
import { SECTORS_A, SECTORS_B } from "@/components/landing/data";
import { Band, Label, Reveal } from "@/components/landing/Primitives";

const METRICS = [
  { label: "CAGR", a: "22.4%", b: "18.1%" },
  { label: "Holdings", a: "24", b: "38" },
  { label: "Top Sector", a: "Technology", b: "Financials" },
  { label: "Years Active", a: "5", b: "8" },
  { label: "Diversification", a: "7.4 / 10", b: "9.1 / 10" },
];

const SIDES = [
  { name: "Arjun S.", initial: "A", sectors: SECTORS_A },
  { name: "Priya M.", initial: "P", sectors: SECTORS_B },
];

/** A portfolio's header and fingerprint, above the shared metric rows. */
function Side({ index }: { index: number }) {
  const side = SIDES[index];
  return (
    <>
      <div className="mb-7 flex items-center gap-2.5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-[15px] font-semibold text-l-accent"
          style={{ background: "rgba(108,142,255,0.09)" }}
        >
          {side.initial}
        </div>
        <div>
          <div className="text-base font-semibold text-l-text">{side.name}</div>
          <div className="font-mono text-[10px] tracking-[0.06em] text-l-text-3">
            VERIFIED IDENTITY
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <Fingerprint
          sectors={side.sectors}
          size={180}
          numRings={9}
          label={`${side.name} portfolio fingerprint`}
        />
      </div>
    </>
  );
}

/**
 * "Portfolio Comparison" — two identities either side of a centre label rail.
 *
 * The spec aligns the centre labels to the metric rows with a hardcoded
 * spacer (`96 + 28 + 180 + 28`). That holds only while the fonts, avatar and
 * fingerprint render at exactly the assumed heights. Here the metrics are one
 * three-column grid instead, so each label sits in the same row as its two
 * values by construction — identical visually, and it cannot drift.
 *
 * Below `lg` the three columns would crush, so the two identities stack and
 * the metric label moves above its pair.
 */
export function ComparisonSection() {
  const reduceMotion = useReducedMotion();

  const slideIn = (fromLeft: boolean, delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, x: fromLeft ? -20 : 20 },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true, amount: 0.15 },
          transition: { duration: 0.8, delay, ease: "easeOut" as const },
        };

  return (
    <Band>
      <Reveal>
        <Label>Portfolio Comparison</Label>
        <div className="mb-14 text-center lg:mb-[72px]">
          <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-light leading-[1.2] tracking-[-0.02em] text-l-text">
            Two identities. No winner.
            <br />
            <span className="font-bold">Only facts.</span>
          </h2>
        </div>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-start lg:gap-0">
        <m.div
          className="rounded-xl border border-l-border bg-l-surface px-9 py-10 lg:rounded-r-none"
          {...slideIn(true, 0)}
        >
          <Side index={0} />
        </m.div>

        {/* The centre rail only exists at lg — stacked, each label sits with
            its own row instead. */}
        <div
          className="hidden self-stretch border-y border-l-border bg-l-surface-2 lg:block"
          aria-hidden="true"
        />

        <m.div
          className="rounded-xl border border-l-border bg-l-surface px-9 py-10 lg:rounded-l-none"
          {...slideIn(false, 0.15)}
        >
          <Side index={1} />
        </m.div>

        {/* Metric rows span the full width so labels and values share a row. */}
        <dl className="contents">
          {METRICS.map((metric) => (
            <div key={metric.label} className="contents">
              <div className="flex items-center justify-between gap-4 border-x border-b border-l-border bg-l-surface px-9 py-2 lg:justify-end lg:border-x-0 lg:border-l lg:px-9">
                <dt className="font-mono text-[9px] uppercase tracking-[0.1em] text-l-text-3 lg:hidden">
                  {metric.label}
                </dt>
                <dd className="font-mono text-[13px] text-l-text">{metric.a}</dd>
              </div>

              <dt className="hidden items-center justify-center whitespace-nowrap border-b border-l-border bg-l-surface-2 px-5 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-l-text-3 lg:flex">
                {metric.label}
              </dt>

              <div className="flex items-center justify-between gap-4 border-x border-b border-l-border bg-l-surface px-9 py-2 lg:justify-start lg:border-x-0 lg:border-r">
                <dt className="font-mono text-[9px] uppercase tracking-[0.1em] text-l-text-3 lg:hidden">
                  {metric.label}
                </dt>
                <dd className="font-mono text-[13px] text-l-text">{metric.b}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </Band>
  );
}
