"use client";

import { m, useReducedMotion } from "framer-motion";

import { Fingerprint } from "@/components/landing/Fingerprint";
import { Sparkline } from "@/components/landing/Sparkline";
import { SECTORS_A } from "@/components/landing/data";

/** Per-sector bar colours, in the design's order. */
const SECTOR_COLORS = [
  "#6C8EFF", "#5DDFB8", "#C084FC", "#FB923C",
  "#F87171", "#38BDF8", "#FBBF24", "#94A3B8",
];

const METRICS = [
  { label: "CAGR", value: "22.4%", sub: "Since inception" },
  { label: "Holdings", value: "24", sub: "Unique securities" },
  { label: "Diversification", value: "8.2 / 10", sub: "Sector spread" },
];

/** The full verified identity card — the design's centrepiece artifact. */
export function IdentityCard() {
  const reduceMotion = useReducedMotion();

  return (
    <m.div
      className="mx-auto max-w-[900px] rounded-[20px] border border-l-border bg-l-surface p-6 sm:p-10 lg:px-12"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-[60px]">
        <div>
          <Fingerprint
            sectors={SECTORS_A}
            size={200}
            numRings={10}
            label="Arjun S. portfolio fingerprint"
          />
          <div className="mt-5">
            <div className="mb-2 flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full border border-l-accent-20 text-[13px] font-semibold text-l-accent"
                style={{ background: "rgba(108,142,255,0.13)" }}
              >
                A
              </div>
              <div>
                <div className="text-[15px] font-semibold text-l-text">Arjun S.</div>
                <div className="font-mono text-[10px] tracking-[0.06em] text-l-text-3">
                  Investor since 2019
                </div>
              </div>
            </div>

            <div className="flex w-fit items-center gap-1.5 rounded-md border border-l-accent-20 bg-l-accent-10 px-2.5 py-[5px]">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="var(--l-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-mono text-[10px] tracking-[0.1em] text-l-accent">
                BROKER VERIFIED
              </span>
            </div>

            {/* Spec read "Zerodha Kite". Nexarch integrates Upstox and Dhan;
                naming an unbuilt broker on a verification line asserts a
                partnership that does not exist. */}
            <div className="mt-2.5 font-mono text-[10px] leading-[1.7] text-l-text-3">
              NXRCH·2024·ARJ·7F2A
              <br />
              Upstox · Read-only
              <br />
              Sealed: 02 Aug 2024, 09:31 IST
            </div>
          </div>
        </div>

        <div>
          {/* gap-px over a border-coloured background renders the hairline
              dividers without three separate border declarations. */}
          <dl className="mb-8 grid grid-cols-1 gap-px overflow-hidden rounded-[10px] bg-l-border sm:grid-cols-3">
            {/* Not `m` — that identifier is the Framer Motion component in
                this module, and shadowing it here would silently break any
                future <m.*> added inside this map. */}
            {METRICS.map((metric) => (
              <div key={metric.label} className="bg-l-surface-2 px-5 py-[18px]">
                <dt className="mb-1.5 font-mono text-[10px] tracking-[0.1em] text-l-text-3">
                  {metric.label}
                </dt>
                <dd>
                  <span className="font-mono text-[22px] font-medium tracking-[-0.01em] text-l-text">
                    {metric.value}
                  </span>
                  <span className="mt-1 block text-[11px] text-l-text-3">{metric.sub}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mb-3.5 font-mono text-[10px] tracking-[0.1em] text-l-text-3">
            SECTOR ALLOCATION
          </div>
          <ul className="flex flex-col gap-2.5">
            {SECTORS_A.map((sector, i) => (
              <li key={sector.name} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-xs text-l-text-2">{sector.name}</span>
                <span className="h-1 flex-1 overflow-hidden rounded-sm bg-l-surface-2">
                  <m.span
                    className="block h-full rounded-sm opacity-75"
                    style={{ background: SECTOR_COLORS[i % SECTOR_COLORS.length] }}
                    initial={reduceMotion ? false : { width: 0 }}
                    whileInView={{ width: `${sector.weight * 100}%` }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.07, ease: "easeOut" }}
                  />
                </span>
                <span className="w-9 text-right font-mono text-[11px] text-l-text-2">
                  {Math.round(sector.weight * 100)}%
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-7 border-t border-l-border pt-5">
            <div className="mb-3 font-mono text-[10px] tracking-[0.1em] text-l-text-3">
              PORTFOLIO VALUE TIMELINE
            </div>
            <Sparkline />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-l-text-3">
              <span>2019</span>
              <span>2024</span>
            </div>
          </div>
        </div>
      </div>
    </m.div>
  );
}
