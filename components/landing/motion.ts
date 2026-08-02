import type { Transition, Variants } from "framer-motion";

/**
 * Shared motion for the landing page.
 *
 * The Figma prototype drives every reveal with an IntersectionObserver that
 * toggles `opacity` and `translateY(20px)` over 0.8s ease. These variants
 * reproduce that exactly, but through Framer Motion's `whileInView` so the
 * observer wiring isn't hand-rolled per section.
 *
 * Only `opacity` and `transform` are animated — both compositor properties,
 * so a scroll-triggered reveal never triggers layout.
 */

/** The prototype's reveal curve: 0.8s, ease. */
export const REVEAL_TRANSITION: Transition = {
  duration: 0.8,
  ease: "easeOut",
};

/** Matches the prototype's `translateY(20px)` -> 0 section reveal. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: REVEAL_TRANSITION },
};

/** The hero's slightly longer entrance (`fadeUp`, 24px in the prototype). */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
};

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

/**
 * Stagger container. `staggerChildren` reproduces the prototype's per-item
 * delays without each child carrying a hardcoded `transitionDelay`.
 */
export function staggerVariants(stagger = 0.06, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
}

/**
 * Shared `whileInView` config.
 *
 * `once: true` matches the prototype — its observer sets state on first
 * intersection and never unsets, so sections don't re-animate when scrolled
 * back past. `amount` mirrors the 0.1–0.15 thresholds it used.
 */
export const inViewOnce = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, amount: 0.15 },
} as const;

/** Looser threshold for tall blocks that would otherwise never hit 0.15. */
export const inViewOnceLoose = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, amount: 0.05 },
} as const;
