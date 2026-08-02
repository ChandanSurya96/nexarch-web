"use client";

import { m, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

import { inViewOnce, inViewOnceLoose, revealVariants } from "@/components/landing/motion";

/**
 * Landing-page layout primitives, matching the Figma spec.
 *
 * The design centres every section on a 1200px column with 40px gutters. That
 * measurement lives here once rather than on each section.
 */

/** max-width 1200, 40px gutters (24 below `sm`, so the gutter isn't half the
 *  viewport on a phone). */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-6 sm:px-10 ${className}`}>{children}</div>
  );
}

/**
 * A scroll-triggered reveal — the prototype's `Section` wrapper.
 *
 * Honours `prefers-reduced-motion` by rendering the final state immediately
 * rather than animating to it. Framer Motion doesn't read the media query for
 * us, and the global CSS override in globals.css only neutralises CSS
 * animation, not JS-driven transforms.
 */
export function Reveal({
  children,
  className = "",
  loose = false,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Lower the intersection threshold for very tall blocks. */
  loose?: boolean;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <m.div
      className={className}
      variants={revealVariants}
      transition={delay ? { delay } : undefined}
      {...(loose ? inViewOnceLoose : inViewOnce)}
    >
      {children}
    </m.div>
  );
}

/**
 * The accent eyebrow above every section heading.
 *
 * Mono, 11px, 0.12em tracking, uppercase — tier-three type carried by face and
 * tracking rather than by colour, which is what lets the palette stay
 * accessible without flattening the hierarchy.
 */
export function Label({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.12em] text-l-accent opacity-90">
      {children}
    </div>
  );
}

/**
 * A full-width band with the hairline rule that separates every section in the
 * design, plus its 128px vertical rhythm.
 */
export function Band({
  children,
  id,
  className = "",
  divided = true,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  /** The hero has no rule above it. */
  divided?: boolean;
}) {
  return (
    <section
      id={id}
      className={[
        "py-20 sm:py-28 lg:py-32",
        divided ? "border-t border-l-border" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Container>{children}</Container>
    </section>
  );
}
