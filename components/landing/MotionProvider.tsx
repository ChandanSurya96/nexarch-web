"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import { ReactNode } from "react";

/**
 * Loads only the Framer Motion features this page actually uses.
 *
 * Importing `motion` pulls the full feature bundle (~34 kB gzipped) into the
 * route. Every animation here is opacity, transform or width — all covered by
 * `domAnimation`, which pairs with the `m` component to ship roughly a fifth
 * of that. Layout projection and drag are the expensive parts, and nothing on
 * this page needs them.
 *
 * The trade: `m` components only animate once this provider has mounted, so
 * every landing component must use `m.*`, never `motion.*`.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
