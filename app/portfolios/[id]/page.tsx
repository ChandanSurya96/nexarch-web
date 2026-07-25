"use client";

import { useParams } from "next/navigation";

import { PortfolioProfileView } from "@/components/portfolio/PortfolioProfileView";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useFollow, useUnfollow } from "@/lib/hooks/useFollow";
import { useFollowingIds } from "@/lib/hooks/useFollowingIds";
import { usePortfolioProfile } from "@/lib/hooks/usePortfolioProfile";

/**
 * Read-only viewer for any portfolio — verified or Public Investor Library,
 * both are just Portfolio rows (ADR-006), so one route serves both. This is
 * the page Milestone 4c's discovery feed and library cards will link to.
 */
export default function PortfolioPage() {
  const params = useParams<{ id: string }>();
  const portfolioId = params.id;
  const { user } = useAuth();

  const { data: profile, isLoading, error } = usePortfolioProfile(portfolioId);
  const { data: followingIds } = useFollowingIds(!!user);
  const follow = useFollow(portfolioId);
  const unfollow = useUnfollow(portfolioId);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-text-secondary">Loading…</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-negative">This portfolio isn&apos;t available.</p>
      </div>
    );
  }

  const isFollowing = followingIds?.has(portfolioId) ?? false;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {user && (
        <div className="mb-6 flex justify-end">
          <Button
            variant={isFollowing ? "secondary" : "primary"}
            onClick={() => (isFollowing ? unfollow.mutate() : follow.mutate())}
            disabled={follow.isPending || unfollow.isPending}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        </div>
      )}
      <PortfolioProfileView profile={profile} isOwner={false} />
    </div>
  );
}
