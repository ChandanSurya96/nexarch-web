"use client";

import { usePathname } from "next/navigation";

import { Nav } from "@/components/Nav";

/**
 * Picks the right navigation for the route.
 *
 * The marketing landing page has its own fixed, transparent-over-hero nav from
 * the Figma spec, and it must not sit under the product's sticky bar as well.
 * Rendering both was the alternative; splitting the app into `(marketing)` and
 * `(app)` route groups was the other. This is the smallest change that keeps
 * every existing route's URL and layout untouched.
 *
 * The landing page renders its own nav, so this returns nothing there.
 */
export function SiteNav() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return <Nav />;
}
