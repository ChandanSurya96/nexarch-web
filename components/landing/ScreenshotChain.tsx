"use client";

import { ReactNode } from "react";

import { Fingerprint } from "@/components/landing/Fingerprint";
import { SECTORS_A } from "@/components/landing/data";

const GAIN = "#5DDFB8";
const LOSS = "#FF7070";

const ALL_POSITIONS: [string, string, boolean][] = [
  ["RELIANCE", "+38.2%", true],
  ["INFY", "+24.1%", true],
  ["TCS", "+12.4%", true],
  ["HDFC", "-18.3%", false],
  ["ZOMATO", "-31.7%", false],
];

/** A mock holdings readout — the "screenshot" being critiqued. */
function PositionList({ rows, cropped = false }: { rows: [string, string, boolean][]; cropped?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-l-surface-2 px-3.5 py-3 font-mono text-xs">
      <div className="mb-2 text-[10px] tracking-[0.08em] text-l-text-3">
        PORTFOLIO · {cropped ? "TOP WINNERS" : "ALL POSITIONS"}
      </div>
      {rows.map(([ticker, value, isGain]) => (
        <div
          key={ticker}
          className="flex justify-between border-b border-l-border-dim py-1"
          style={{ color: isGain ? GAIN : LOSS, opacity: isGain ? 1 : 0.35 }}
        >
          <span className="text-l-text-2">{ticker}</span>
          <span>{value}</span>
        </div>
      ))}
      {cropped && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-8"
          style={{ background: "linear-gradient(transparent, var(--l-surface-2))" }}
        />
      )}
    </div>
  );
}

const STEPS: { step: string; label: string; content: ReactNode; flaw: string; isFlaw: boolean }[] = [
  {
    step: "01",
    label: "The Screenshot",
    content: <PositionList rows={ALL_POSITIONS} />,
    flaw: "Complete view of all positions",
    isFlaw: false,
  },
  {
    step: "02",
    label: "The Crop",
    content: <PositionList rows={ALL_POSITIONS.slice(0, 3)} cropped />,
    flaw: "Losses hidden below the fold",
    isFlaw: true,
  },
  {
    step: "03",
    label: "The Claim",
    content: (
      <div className="flex items-center gap-4 rounded-lg bg-l-surface-2 p-4">
        {/* text-l-text, not the spec's text-2: #7C8090 on the --l-border fill
            measures 4.19:1 and fails AA. The muted-circle intent survives. */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-l-border text-sm font-semibold text-l-text">
          A
        </div>
        <div>
          <div className="mb-1 text-[13px] font-medium text-l-text">
            Generated +28.4% this year 🚀
          </div>
          <div className="text-[11px] text-l-text-3">11.2k views · 843 likes · No verification</div>
        </div>
      </div>
    ),
    flaw: "No starting capital, no context, no proof",
    isFlaw: true,
  },
];

/** The three-step degradation from full holdings to an unverifiable boast. */
export function ScreenshotChain() {
  return (
    <div className="flex flex-col">
      {STEPS.map((item, idx) => (
        <div key={item.step} className="flex gap-5">
          <div className="flex flex-col items-center">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-l-border bg-l-surface-2 font-mono text-[10px] text-l-text-3">
              {item.step}
            </div>
            {idx < STEPS.length - 1 && (
              <div aria-hidden="true" className="my-1.5 min-h-6 w-px flex-1 bg-l-border" />
            )}
          </div>
          <div className={`flex-1 ${idx < STEPS.length - 1 ? "pb-5" : ""}`}>
            <div className="mb-2.5 font-mono text-[10px] tracking-[0.08em] text-l-text-3">
              {item.label}
            </div>
            {item.content}
            <div className="mt-2 flex items-center gap-1.5">
              {item.isFlaw && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <circle cx="5" cy="5" r="4" stroke={LOSS} strokeWidth="1" />
                  <path d="M5 3v3M5 7.5v.5" stroke={LOSS} strokeWidth="1" strokeLinecap="round" />
                </svg>
              )}
              <span
                className="text-[11px]"
                style={{ color: item.isFlaw ? LOSS : "var(--l-text-3)" }}
              >
                {item.flaw}
              </span>
            </div>
          </div>
        </div>
      ))}

      <div className="my-5 ml-12 flex items-center gap-4">
        <div aria-hidden="true" className="h-px flex-1" style={{ background: "linear-gradient(to right, var(--l-border), var(--l-accent-20))" }} />
        <span className="font-mono text-[10px] tracking-[0.1em] text-l-accent">
          NEXARCH REPLACES THIS
        </span>
        <div aria-hidden="true" className="h-px flex-1" style={{ background: "linear-gradient(to left, var(--l-border), var(--l-accent-20))" }} />
      </div>

      <div className="ml-12 flex items-center gap-5 rounded-xl border border-l-accent-20 bg-l-surface px-5 py-4">
        <Fingerprint sectors={SECTORS_A} size={72} numRings={6} label="Verified portfolio fingerprint" />
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-l-text">Arjun S.</span>
            <span className="flex items-center gap-1 rounded border border-l-accent-20 bg-l-accent-10 px-2 py-0.5">
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                <path d="M1.5 4.5l2 2 4-4" stroke="var(--l-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-mono text-[9px] tracking-[0.08em] text-l-accent">VERIFIED</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-4 font-mono text-[11px] text-l-text-3">
            <span>CAGR <span className="text-l-text-2">22.4%</span></span>
            <span>Holdings <span className="text-l-text-2">24</span></span>
            <span>Active <span className="text-l-text-2">5 yrs</span></span>
          </div>
          {/* Spec read "· Zerodha ·". Nexarch has Upstox and Dhan integrations;
              Zerodha is unbuilt, and broker-integrations.md flags its Kite
              Connect terms as an unresolved risk for exactly this kind of
              public display. Named the integration that exists. */}
          <div className="mt-1.5 font-mono text-[10px] tracking-[0.04em] text-l-text-3">
            NXRCH·2024·ARJ·7F2A · Upstox · Verified 2 hours ago
          </div>
        </div>
      </div>
    </div>
  );
}
