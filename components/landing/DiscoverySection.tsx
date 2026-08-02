"use client";

import { useState } from "react";

import { DiscoveryCard } from "@/components/landing/DiscoveryCard";
import { DISCOVERY_PORTFOLIOS, FILTER_TAGS } from "@/components/landing/data";
import { Band, Label, Reveal } from "@/components/landing/Primitives";

/**
 * "Investor Discovery" — a filterable grid of verified portfolio identities.
 *
 * Filtering dims rather than removes, so the grid holds its shape. The count
 * is announced in a live region because a purely visual opacity change tells
 * a screen-reader user nothing about what the filter did.
 */
export function DiscoverySection() {
  const [activeFilter, setActiveFilter] = useState("all");

  const matches = (tags: string[]) => activeFilter === "all" || tags.includes(activeFilter);
  const visibleCount = DISCOVERY_PORTFOLIOS.filter((p) => matches(p.tags)).length;

  return (
    <Band id="discovery">
      <Reveal loose>
        <Label>Investor Discovery</Label>

        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-[500px] text-[clamp(2rem,3.5vw,3rem)] font-light leading-[1.2] tracking-[-0.02em] text-l-text">
            A universe of verified
            <br />
            <span className="font-bold">portfolio identities.</span>
          </h2>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter portfolios">
            {FILTER_TAGS.map((tag) => {
              const isActive = activeFilter === tag.id;
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => setActiveFilter(tag.id)}
                  // aria-pressed exposes the toggle state; the border and
                  // colour change alone communicate nothing non-visually.
                  aria-pressed={isActive}
                  className={[
                    "rounded-[20px] border px-4 py-[7px] text-xs",
                    "transition-colors duration-200 ease-out",
                    isActive
                      ? "border-l-accent bg-l-accent-10 text-l-accent"
                      : "border-l-border text-l-text-2 hover:text-l-text",
                  ].join(" ")}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          {visibleCount} of {DISCOVERY_PORTFOLIOS.length} portfolios match the current filter.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DISCOVERY_PORTFOLIOS.map((portfolio) => (
            <DiscoveryCard
              key={portfolio.id}
              portfolio={portfolio}
              isVisible={matches(portfolio.tags)}
            />
          ))}
        </div>
      </Reveal>
    </Band>
  );
}
