"use client";

import { useEffect, useState } from "react";

import { Container } from "@/components/landing/Primitives";
import { Wordmark } from "@/components/landing/Wordmark";

/**
 * Section anchors.
 *
 * The Figma prototype wires all three of these to `href="#"`, which navigates
 * nowhere. The section ids it defines (`how`, `early-access`) make the intent
 * obvious, so these point at the real sections — the labels and order are
 * unchanged, the links simply work.
 */
const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#discovery", label: "Discovery" },
  { href: "#philosophy", label: "Philosophy" },
];

/**
 * Fixed marketing nav.
 *
 * Transparent over the hero, then a blurred translucent bar with a hairline
 * rule once the page scrolls past 30px — the design's way of letting the hero
 * run full-bleed while keeping the nav legible over content.
 */
export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    // passive: this listener never calls preventDefault, and saying so keeps
    // it off the main thread's scroll-blocking path.
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={[
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ease-out",
        scrolled
          ? "border-l-border bg-[rgba(10,11,14,0.92)] backdrop-blur-[20px]"
          : "border-transparent bg-transparent",
      ].join(" ")}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          <a href="#top" className="rounded-md" aria-label="Nexarch — back to top">
            <Wordmark />
          </a>

          <div className="flex items-center gap-6 sm:gap-8">
            {/* Section links collapse below `sm`: at 375px the three labels plus
                the CTA cannot share a 64px bar without wrapping, and the CTA is
                the one that has to survive. */}
            <div className="hidden items-center gap-8 sm:flex">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded text-[13px] text-l-text-2 transition-colors duration-200 hover:text-l-text"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <a
              href="#early-access"
              className="rounded-md border border-l-accent-20 bg-l-accent-10 px-[18px] py-[7px] text-[13px] text-l-accent transition-colors duration-200 hover:bg-l-accent-20"
            >
              Join Early Access
            </a>
          </div>
        </div>
      </Container>
    </nav>
  );
}
