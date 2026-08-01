"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { PortfolioProfileView } from "@/components/portfolio/PortfolioProfileView";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageContainer } from "@/components/ui/Layout";
import { ProfileSkeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useFollow, useUnfollow } from "@/lib/hooks/useFollow";
import { useFollowingIds } from "@/lib/hooks/useFollowingIds";
import { useMyPortfolio } from "@/lib/hooks/useMyPortfolio";
import { usePortfolioProfile } from "@/lib/hooks/usePortfolioProfile";

/**
 * Read-only viewer for any portfolio — verified or Public Investor Library,
 * both are just Portfolio rows (ADR-006), so one route serves both. This is
 * the page the discovery feed and library cards link to.
 */
export default function PortfolioPage() {
  const params = useParams<{ id: string }>();
  const portfolioId = params.id;
  const { user } = useAuth();

  const { data: profile, isLoading, error } = usePortfolioProfile(portfolioId);
  const { data: followingIds } = useFollowingIds(!!user);
  const { data: myPortfolio } = useMyPortfolio({ enabled: !!user });
  const follow = useFollow(portfolioId);
  const unfollow = useUnfollow(portfolioId);

  if (isLoading) {
    return (
      <PageContainer width="default">
        <ProfileSkeleton />
      </PageContainer>
    );
  }

  if (error || !profile) {
    return (
      <PageContainer width="default">
        <EmptyState
          title="This portfolio isn't available"
          description="It may be private, or the link may be wrong."
          action={
            <Link href="/discover">
              <Button variant="secondary">Browse investors</Button>
            </Link>
          }
        />
      </PageContainer>
    );
  }

  const isFollowing = followingIds?.has(portfolioId) ?? false;

  return (
    <PageContainer width="default">
      {user && (
        <div className="mb-8 flex flex-wrap justify-end gap-2">
          <Button
            variant={isFollowing ? "secondary" : "primary"}
            onClick={() => (isFollowing ? unfollow.mutate() : follow.mutate())}
            disabled={follow.isPending || unfollow.isPending}
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
          {myPortfolio && myPortfolio.id !== portfolioId && (
            <Link
              href={`/compare?a=${myPortfolio.id}&b=${portfolioId}`}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border-strong px-4 text-body-sm font-medium text-text-primary transition-colors duration-base ease-out hover:bg-bg-surface-hover"
            >
              Compare with mine
            </Link>
          )}
        </div>
      )}
      <PortfolioProfileView profile={profile} isOwner={false} />
    </PageContainer>
  );
}
