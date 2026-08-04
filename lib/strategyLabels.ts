"use client";

import { useMemo } from "react";

import { useStrategyCategories } from "@/lib/hooks/useStrategyCategories";

/**
 * Reformats a slug's own characters into something readable.
 *
 * This is a last resort, not the primary path: it only ever rearranges
 * characters that are already in the slug, so it cannot invent a label for a
 * category the API doesn't know about. If a tag reaches this function it means
 * the portfolio carries a strategy the categories endpoint didn't return —
 * showing `Small cap specialist` is still truer than showing the raw slug.
 */
export function humanizeSlug(slug: string): string {
  const spaced = slug.replace(/-/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/**
 * Maps a strategy slug to the display name the API defines for it.
 *
 * `strategy_tags` on a portfolio are slugs — they are the category's identity,
 * not its label. The human-readable `name` lives on
 * `GET /discovery/strategy-categories`, which the discovery filter already
 * renders. The cards did not, so on `/discover` the very same category read
 * "Small-cap Specialist" in the filter chip and "small-cap-specialist" on the
 * card immediately below it. One concept, two spellings, side by side.
 *
 * Resolving against the API rather than transforming the slug keeps a single
 * source of truth: renaming a category in the backend renames it everywhere,
 * and no display string is duplicated in the frontend.
 *
 * React Query caches the category list under one key, so calling this from
 * every card in a list costs one request, not one per card.
 */
export function useStrategyLabels(): (slug: string) => string {
  const { data: categories } = useStrategyCategories();

  return useMemo(() => {
    const bySlug = new Map((categories ?? []).map((c) => [c.slug, c.name]));
    return (slug: string) => bySlug.get(slug) ?? humanizeSlug(slug);
  }, [categories]);
}
