"use client";

import { Fingerprint } from "@/components/landing/Fingerprint";
import type { DiscoveryPortfolio } from "@/components/landing/data";

const SECTOR_COLORS = [
  "#6C8EFF", "#5DDFB8", "#C084FC", "#FB923C",
  "#F87171", "#38BDF8", "#FBBF24", "#94A3B8",
];

/**
 * One portfolio in the discovery grid.
 *
 * Filtered-out cards drop to 20% opacity rather than unmounting, so the grid
 * never reflows as filters change — that stability is the point of the
 * design's approach, and it also avoids a layout thrash per keystroke.
 *
 * `aria-hidden` follows the dimming: a card faded to 20% is not part of the
 * current result set, and a screen reader shouldn't read it as one.
 */
export function DiscoveryCard({
  portfolio,
  isVisible,
}: {
  portfolio: DiscoveryPortfolio;
  isVisible: boolean;
}) {
  return (
    <div
      aria-hidden={!isVisible}
      className={[
        "rounded-xl border border-l-border bg-l-surface p-6",
        "transition-[opacity,border-color] duration-300 ease-out",
        isVisible ? "opacity-100 hover:border-l-accent-20" : "opacity-20",
      ].join(" ")}
    >
      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-[13px] font-semibold text-l-accent"
            style={{ background: "rgba(108,142,255,0.09)" }}
          >
            {portfolio.name.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-semibold text-l-text">{portfolio.name}</div>
            <div className="text-[11px] text-l-text-3">{portfolio.topSector}</div>
          </div>
        </div>
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
          <path d="M1 4.5l2.5 2.5 4.5-5" stroke="var(--l-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="mb-5 flex justify-center">
        <Fingerprint
          sectors={portfolio.sectors}
          size={80}
          numRings={6}
          label={`${portfolio.name} portfolio fingerprint`}
        />
      </div>

      <ul className="mb-5 flex flex-col gap-1.5">
        {portfolio.sectors.slice(0, 4).map((sector, i) => (
          <li key={i} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-[1px] opacity-80"
              style={{ background: SECTOR_COLORS[i] }}
            />
            <span className="h-[3px] flex-1 overflow-hidden rounded-sm bg-l-surface-2">
              <span
                className="block h-full rounded-sm opacity-70"
                style={{ background: SECTOR_COLORS[i], width: `${sector.weight * 100}%` }}
              />
            </span>
            <span className="w-7 text-right font-mono text-[10px] text-l-text-3">
              {Math.round(sector.weight * 100)}%
            </span>
          </li>
        ))}
      </ul>

      <dl className="grid grid-cols-3 gap-2 border-t border-l-border pt-4">
        {[
          { label: "CAGR", value: portfolio.cagr },
          { label: "STOCKS", value: String(portfolio.stocks) },
          { label: "YEARS", value: String(portfolio.years) },
        ].map((m) => (
          <div key={m.label} className="text-center">
            <dd className="font-mono text-sm font-medium text-l-text">{m.value}</dd>
            <dt className="mt-0.5 font-mono text-[9px] tracking-[0.08em] text-l-text-3">
              {m.label}
            </dt>
          </div>
        ))}
      </dl>
    </div>
  );
}
