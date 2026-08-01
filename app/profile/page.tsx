"use client";

import { useState } from "react";

import { PortfolioProfileView } from "@/components/portfolio/PortfolioProfileView";
import { RequireAuth } from "@/components/RequireAuth";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageContainer, PageSection } from "@/components/ui/Layout";
import { Modal } from "@/components/ui/Modal";
import { ProfileSkeleton } from "@/components/ui/Skeleton";
import { InfoList, InfoRow, Surface } from "@/components/ui/Surface";
import { useBrokerConnections } from "@/lib/hooks/useBrokerConnections";
import { useDisconnectBroker } from "@/lib/hooks/useDisconnectBroker";
import { useInitBrokerConnection } from "@/lib/hooks/useInitBrokerConnection";
import { useMyPortfolio } from "@/lib/hooks/useMyPortfolio";
import { usePortfolioProfile } from "@/lib/hooks/usePortfolioProfile";
import { useSyncNow } from "@/lib/hooks/useSyncNow";
import { useUpdateVisibility } from "@/lib/hooks/useUpdateVisibility";

const UPSTOX = "upstox";

function ConnectedProfile({
  portfolioId,
  connectionId,
}: {
  portfolioId: string;
  connectionId: string | null;
}) {
  const { data: profile, isLoading, error } = usePortfolioProfile(portfolioId);
  const disconnectBroker = useDisconnectBroker();
  const syncNow = useSyncNow();
  const updateVisibility = useUpdateVisibility(portfolioId);
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const [visibilityOpen, setVisibilityOpen] = useState(false);

  if (isLoading) return <ProfileSkeleton />;
  if (error || !profile) {
    return (
      <EmptyState
        title="Couldn't load your portfolio"
        description="The request didn't complete. Refresh the page to try again."
      />
    );
  }

  const isPublic = profile.portfolio.isPublic;

  return (
    <>
      {/* The portfolio itself leads. Owner controls used to sit in a button bar
          above the identity, which put account plumbing ahead of the thing the
          page is actually about. */}
      <PortfolioProfileView profile={profile} isOwner />

      {/* Broker & privacy — last, and deliberately quiet. These are settings,
          not content: rendered as labelled rows on a recessive surface rather
          than as a row of prominent buttons competing with the data above. */}
      <PageSection title="Broker & privacy">
        <Surface tone="quiet" padding="none">
          <InfoList className="px-5">
            <InfoRow
              label="Broker connection"
              hint={
                connectionId
                  ? "Holdings refresh automatically once a day."
                  : "Reconnect to resume automatic daily refreshes."
              }
              value={
                <div className="flex items-center gap-2">
                  <Badge variant={connectionId ? "verified" : "public"}>
                    {connectionId ? "Connected" : "Not connected"}
                  </Badge>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => connectionId && syncNow.mutate(connectionId)}
                    disabled={syncNow.isPending || !connectionId}
                  >
                    {syncNow.isPending ? "Syncing…" : "Sync now"}
                  </Button>
                </div>
              }
            />

            <InfoRow
              label="Profile visibility"
              hint={
                isPublic
                  ? "Anyone browsing Nexarch can see your holdings."
                  : "Only you can see your holdings."
              }
              value={
                <div className="flex items-center gap-2">
                  <Badge variant="tag">{isPublic ? "Public" : "Private"}</Badge>
                  <Button variant="secondary" size="sm" onClick={() => setVisibilityOpen(true)}>
                    {isPublic ? "Make private" : "Make public"}
                  </Button>
                </div>
              }
            />

            {connectionId && (
              <InfoRow
                label="Disconnect broker"
                hint="Deletes your stored broker token. Synced holdings stay visible."
                value={
                  <Button variant="ghost" size="sm" onClick={() => setDisconnectOpen(true)}>
                    Disconnect
                  </Button>
                }
              />
            )}
          </InfoList>
        </Surface>
      </PageSection>

      <Modal
        open={disconnectOpen}
        title="Disconnect broker?"
        onClose={() => setDisconnectOpen(false)}
        confirmLabel="Disconnect"
        isConfirming={disconnectBroker.isPending}
        onConfirm={() => {
          if (connectionId) disconnectBroker.mutate(connectionId);
          setDisconnectOpen(false);
        }}
      >
        This deletes your stored broker token immediately. Your previously synced holdings stay
        visible, but won&apos;t refresh until you reconnect.
      </Modal>

      <Modal
        open={visibilityOpen}
        title={isPublic ? "Make your profile private?" : "Make your profile public?"}
        onClose={() => setVisibilityOpen(false)}
        confirmLabel={isPublic ? "Make private" : "Make public"}
        isConfirming={updateVisibility.isPending}
        onConfirm={() => {
          updateVisibility.mutate(!isPublic);
          setVisibilityOpen(false);
        }}
      >
        {isPublic
          ? "Your holdings will no longer be visible to other Nexarch users."
          : "Your holdings, allocation, and health metrics become visible to anyone browsing Nexarch. Private is the default for a reason — only do this if you're comfortable with that."}
      </Modal>
    </>
  );
}

function ProfileContent() {
  const {
    data: myPortfolio,
    isLoading: portfolioLoading,
    pollExhausted,
  } = useMyPortfolio({ pollWhilePending: true });
  const { data: connections, isLoading: connectionsLoading } = useBrokerConnections();
  const initBroker = useInitBrokerConnection();

  if (portfolioLoading || connectionsLoading) {
    return (
      <PageContainer width="default">
        <ProfileSkeleton />
      </PageContainer>
    );
  }

  // Phase 1 supports one broker at a time — the first connection is "the" one.
  const connection = connections?.[0] ?? null;

  if (!myPortfolio) {
    if (connection?.status === "expired") {
      return (
        <PageContainer width="default">
          <EmptyState
            title="Your broker connection needs to be reconnected"
            description="Your last sync didn't complete because the connection expired. Reconnecting restores automatic daily refreshes."
            action={
              <Button onClick={() => initBroker.mutate(UPSTOX)} disabled={initBroker.isPending}>
                {initBroker.isPending ? "Redirecting…" : "Reconnect"}
              </Button>
            }
          />
        </PageContainer>
      );
    }

    if (connection) {
      return (
        <PageContainer width="default">
          <EmptyState
            title="Syncing your portfolio…"
            description={
              pollExhausted
                ? "This is taking longer than expected. Your holdings will appear here once the sync completes — check back shortly."
                : "Your broker connection is active. The first sync usually takes a few seconds."
            }
          />
        </PageContainer>
      );
    }

    return (
      <PageContainer width="default">
        <EmptyState
          title="Connect a broker to build your verified profile"
          description="Nexarch reads your holdings directly from your broker, read-only. It cannot place trades or move money."
          action={
            <Button onClick={() => initBroker.mutate(UPSTOX)} disabled={initBroker.isPending}>
              {initBroker.isPending ? "Redirecting…" : "Connect broker"}
            </Button>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer width="default">
      {connection?.status === "expired" && (
        <Surface tone="quiet" className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-body-sm text-text-primary">
            Your broker connection needs to be reconnected.
          </p>
          <Button variant="secondary" size="sm" onClick={() => initBroker.mutate(UPSTOX)}>
            Reconnect
          </Button>
        </Surface>
      )}

      <ConnectedProfile
        portfolioId={myPortfolio.id}
        connectionId={connection && connection.status !== "expired" ? connection.id : null}
      />
    </PageContainer>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}
