"use client";

import Link from "next/link";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Surface } from "@/components/ui/Surface";
import { Eyebrow, Metric } from "@/components/ui/Metric";
import { useAuth } from "@/lib/auth/AuthProvider";
import { formatDate } from "@/lib/format";
import { useFollow, useUnfollow } from "@/lib/hooks/useFollow";
import { useStrategyLabels } from "@/lib/strategyLabels";
import { InvestorCardData } from "@/lib/types/investorCard";

const VERIFIED_TOOLTIP = "Verified: holdings data came from an authenticated broker connection.";
const PUBLIC_TOOLTIP =
  "Public Portfolio: an educational reconstruction from public regulatory disclosures.";

interface InvestorCardProps {
  investor: InvestorCardData;
  isFollowing: boolean;
  /** Hides the Follow button for the viewer's own portfolio — following
   * yourself isn't a real relationship (matches the backend's
   * CANNOT_FOLLOW_OWN_PORTFOLIO rejection in follow_service.py). */
  isOwnPortfolio?: boolean;
  /** The viewer's own portfolio id, if they have one — enables a "Compare
   * with mine" link (Milestone 6). Link-only entry into /compare, no
   * picker (ADR-027) — this is one of the two places that already has
   * both ids at hand. */
  viewerPortfolioId?: string | null;
}

/**
 * The shared list-item summary for both the Discovery Feed and the Public
 * Investor Library.
 *
 * Note on the missing fingerprint: this card would be the highest-value place
 * for the sector band, since it's what makes a grid scannable by shape. The
 * discovery list endpoint returns health metrics but not sector_allocation,
 * and inventing a shape from data we don't have would be worse than omitting
 * it. Diversification carries the summary instead. See docs/design-system.md
 * "Remaining UI debt" for the one-field API change that would unlock it.
 */
export function InvestorCard({
  investor,
  isFollowing,
  isOwnPortfolio = false,
  viewerPortfolioId = null,
}: InvestorCardProps) {
  const { user } = useAuth();
  const strategyLabel = useStrategyLabels();
  const follow = useFollow(investor.portfolioId ?? "");
  const unfollow = useUnfollow(investor.portfolioId ?? "");

  if (!investor.portfolioId) return null; // shouldn't happen past seeding — nothing to link to

  const isVerified = investor.portfolioType === "verified";
  const showActions = user && !isOwnPortfolio;

  return (
    <Surface interactive className="animate-rise flex flex-col">
      {/* The link wraps the summary only, never the action row — a button
          inside a link is both an accessibility violation and a coin-flip for
          which one a click actually hits. */}
      <Link
        href={`/portfolios/${investor.portfolioId}`}
        // No outline-none here: removing the ring without a replacement makes
        // the card unreachable-looking for keyboard users. The global
        // :focus-visible rule in globals.css supplies the indicator.
        className="flex flex-1 flex-col rounded-lg"
      >
        <div className="flex items-start gap-3">
          <Avatar name={investor.displayName} />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-body-sm font-medium text-text-primary">
              {investor.displayName}
            </h3>
            <div className="mt-1.5">
              <Badge
                variant={isVerified ? "verified" : "public"}
                title={isVerified ? VERIFIED_TOOLTIP : PUBLIC_TOOLTIP}
              >
                {isVerified ? "Verified" : "Public Portfolio"}
              </Badge>
            </div>
          </div>
        </div>

        {investor.bio && (
          <p className="mt-3 line-clamp-2 text-body-sm leading-relaxed text-text-secondary">
            {investor.bio}
          </p>
        )}

        {investor.diversificationScore !== null && (
          <div className="mt-4">
            <Eyebrow>Diversification</Eyebrow>
            <Metric value={investor.diversificationScore.toFixed(2)} size="md" className="mt-1" />
          </div>
        )}

        {investor.strategyTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {investor.strategyTags.map((tag) => (
              <Badge key={tag} variant="tag">
                {strategyLabel(tag)}
              </Badge>
            ))}
          </div>
        )}

        {investor.lastDisclosureUpdate && (
          <p className="mt-4 text-caption text-text-tertiary">
            Disclosed {formatDate(investor.lastDisclosureUpdate)}
          </p>
        )}
      </Link>

      {showActions && (
        <div className="mt-5 flex gap-2 border-t border-border pt-4">
          <Button
            variant={isFollowing ? "secondary" : "primary"}
            size="sm"
            onClick={() => (isFollowing ? unfollow.mutate() : follow.mutate())}
            disabled={follow.isPending || unfollow.isPending}
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
          {viewerPortfolioId && (
            <Link
              href={`/compare?a=${viewerPortfolioId}&b=${investor.portfolioId}`}
              className="inline-flex h-8 items-center justify-center rounded-lg border border-border-strong px-3 text-caption font-medium text-text-primary transition-colors duration-base ease-out hover:bg-bg-surface-hover"
            >
              Compare
            </Link>
          )}
        </div>
      )}
    </Surface>
  );
}
