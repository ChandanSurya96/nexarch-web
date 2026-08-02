"use client";

import { m, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

import { Fingerprint } from "@/components/landing/Fingerprint";
import { SECTORS_A } from "@/components/landing/data";
import { Container } from "@/components/landing/Primitives";

/** Broker initials, as in the spec. */
const BROKERS = ["Z", "G", "U", "5P"];

/** The hero's staggered entrance: each element rises 8–16px as it fades. */
function Enter({
  delay,
  y = 12,
  children,
  className = "",
}: {
  delay: number;
  y?: number;
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </m.div>
  );
}

/** A callout pinned to the fingerprint. */
function FloatingCard({
  eyebrow,
  className,
  delay,
  children,
}: {
  eyebrow: string;
  className: string;
  delay: number;
  children: ReactNode;
}) {
  return (
    <Enter delay={delay} y={0} className={`absolute ${className}`}>
      <div className="rounded-lg border border-l-border bg-l-surface px-3.5 py-2.5">
        <div className="mb-1.5 font-mono text-[9px] tracking-[0.1em] text-l-text-3">{eyebrow}</div>
        {children}
      </div>
    </Enter>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden pt-16"
    >
      {/* Ambient glow, offset toward the fingerprint. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 700px 500px at 65% 50%, rgba(108,142,255,0.055) 0%, transparent 70%)",
        }}
      />
      {/* 80px grid, masked to a soft ellipse so it fades before the edges. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(var(--l-border) 1px, transparent 1px), linear-gradient(90deg, var(--l-border) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      <Container className="relative">
        <div className="grid items-center gap-16 py-16 lg:grid-cols-2 lg:gap-20 lg:py-20">
          <div>
            <Enter delay={0.1} y={8}>
              <p className="mb-7 font-mono text-[11px] uppercase tracking-[0.14em] text-l-accent">
                Portfolio Identity &amp; Investor Discovery
              </p>
            </Enter>

            {/* One <h1> split across two visual lines — the design sets them as
                separate blocks at 300 and 700 weight, but a second <h1> would
                break the document outline. */}
            <h1 className="mb-9 text-[clamp(2.6rem,4.5vw,4rem)] leading-[1.15] tracking-[-0.02em] text-l-text">
              <Enter delay={0.2} y={16}>
                <span className="block font-light">Show your portfolio,</span>
              </Enter>
              <Enter delay={0.3} y={16}>
                <span className="block font-bold">not your opinions.</span>
              </Enter>
            </h1>

            <Enter delay={0.4}>
              <p className="mb-11 max-w-[420px] text-[17px] leading-[1.75] text-l-text-2">
                Nexarch generates a verified portfolio identity from your actual broker holdings. No
                screenshots. No self-reporting. Only facts.
              </p>
            </Enter>

            <Enter delay={0.5}>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#early-access"
                  // py-[13px] not py-3.5 (14px) — the spec is 13px 28px.
                  // text-l-accent-on rather than the spec's #fff: white on
                  // #6C8EFF measures 2.60:1 and fails WCAG AA, which this
                  // build is required to meet. Near-black is 6.51:1.
                  className="rounded-lg bg-l-accent px-7 py-[13px] text-sm font-semibold tracking-[0.01em] text-l-accent-on transition-opacity duration-200 hover:opacity-85"
                >
                  Join Early Access
                </a>
                <a
                  href="#how"
                  className="flex items-center gap-2 rounded text-sm text-l-text-2 transition-colors duration-200 hover:text-l-text"
                >
                  See how it works
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </Enter>

            <Enter delay={0.7} y={0}>
              <div className="mt-10 flex flex-wrap items-center gap-2.5">
                <div className="flex gap-1">
                  {BROKERS.map((b) => (
                    <span
                      key={b}
                      className="rounded border border-l-border px-1.5 py-0.5 font-mono text-[9px] tracking-[0.06em] text-l-text-3"
                    >
                      {b}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-l-text-3">Verified via direct broker connection</span>
              </div>
            </Enter>
          </div>

          <Enter delay={0.4} y={0} className="flex items-center justify-center">
            <div className="relative">
              <div
                aria-hidden="true"
                className="animate-pulse-ring absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(108,142,255,0.07) 0%, transparent 70%)",
                }}
              />
              <div className="relative w-full max-w-[420px]">
                <Fingerprint
                  sectors={SECTORS_A}
                  size={420}
                  numRings={13}
                  label="Example portfolio sector fingerprint"
                  className="h-auto w-full"
                />

                <FloatingCard eyebrow="TOP SECTOR" delay={1.2} className="right-[-8%] top-[12%] sm:right-[-15%]">
                  <div className="text-[13px] font-semibold text-l-text">Technology</div>
                  <div className="mt-0.5 font-mono text-[11px] text-l-accent">28.0%</div>
                </FloatingCard>

                <FloatingCard eyebrow="IDENTITY" delay={1.4} className="bottom-[18%] left-[-6%] sm:left-[-12%]">
                  <div className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 6l3 3 5-5" stroke="var(--l-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-xs text-l-text">Broker Verified</span>
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-l-text-3">NXRCH·2024·ARJ·7F2A</div>
                </FloatingCard>
              </div>
            </div>
          </Enter>
        </div>

        <Enter delay={1.5} y={0} className="hidden pb-12 text-center opacity-40 lg:block">
          <span className="inline-flex flex-col items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.12em] text-l-text-3">SCROLL</span>
            <span
              aria-hidden="true"
              className="h-12 w-px"
              style={{ background: "linear-gradient(to bottom, var(--l-border), transparent)" }}
            />
          </span>
        </Enter>
      </Container>
    </section>
  );
}
