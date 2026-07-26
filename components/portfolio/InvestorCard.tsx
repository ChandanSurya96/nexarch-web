"use client";

import Link from "next/link";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useFollow, useUnfollow } from "@/lib/hooks/useFollow";
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

/** The shared list-item summary for both the Discovery Feed and the Public Investor Library. */
export function InvestorCard({
  investor,
  isFollowing,
  isOwnPortfolio = false,
  viewerPortfolioId = null,
}: InvestorCardProps) {
  const { user } = useAuth();
  const follow = useFollow(investor.portfolioId ?? "");
  const unfollow = useUnfollow(investor.portfolioId ?? "");

  if (!investor.portfolioId) return null; // shouldn't happen past seeding — nothing to link to

  const isVerified = investor.portfolioType === "verified";

  return (
    <Card className="flex flex-col gap-3">
      <Link href={`/portfolios/${investor.portfolioId}`} className="flex items-start gap-3">
        <Avatar name={investor.displayName} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-text-primary">{investor.displayName}</span>
            <Badge
              variant={isVerified ? "verified" : "public"}
              title={isVerified ? VERIFIED_TOOLTIP : PUBLIC_TOOLTIP}
            >
              {isVerified ? "Verified" : "Public Portfolio"}
            </Badge>
          </div>
          {investor.bio && (
            <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{investor.bio}</p>
          )}
          {investor.strategyTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {investor.strategyTags.map((tag) => (
                <Badge key={tag} variant="tag">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {investor.diversificationScore !== null && (
            <p className="mt-2 text-xs text-text-secondary">
              Diversification: {investor.diversificationScore.toFixed(2)}
            </p>
          )}
          {investor.lastDisclosureUpdate && (
            <p className="mt-2 text-xs text-text-secondary">
              Disclosed as of{" "}
              {new Date(investor.lastDisclosureUpdate).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          )}
        </div>
      </Link>
      {user && !isOwnPortfolio && (
        <div className="flex gap-2">
          <Button
            variant={isFollowing ? "secondary" : "primary"}
            onClick={() => (isFollowing ? unfollow.mutate() : follow.mutate())}
            disabled={follow.isPending || unfollow.isPending}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
          {viewerPortfolioId && (
            <Link
              href={`/compare?a=${viewerPortfolioId}&b=${investor.portfolioId}`}
              className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-bg-surface-hover"
            >
              Compare with mine
            </Link>
          )}
        </div>
      )}
    </Card>
  );
}
