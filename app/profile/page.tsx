"use client";

import { useState } from "react";

import { PortfolioProfileView } from "@/components/portfolio/PortfolioProfileView";
import { RequireAuth } from "@/components/RequireAuth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { useBrokerConnections } from "@/lib/hooks/useBrokerConnections";
import { useDisconnectBroker } from "@/lib/hooks/useDisconnectBroker";
import { useInitBrokerConnection } from "@/lib/hooks/useInitBrokerConnection";
import { useMyPortfolio } from "@/lib/hooks/useMyPortfolio";
import { usePortfolioProfile } from "@/lib/hooks/usePortfolioProfile";
import { useSyncNow } from "@/lib/hooks/useSyncNow";
import { useUpdateVisibility } from "@/lib/hooks/useUpdateVisibility";

const UPSTOX = "upstox";

function ConnectedProfile({ portfolioId, connectionId }: { portfolioId: string; connectionId: string | null }) {
  const { data: profile, isLoading, error } = usePortfolioProfile(portfolioId);
  const disconnectBroker = useDisconnectBroker();
  const syncNow = useSyncNow();
  const updateVisibility = useUpdateVisibility(portfolioId);
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const [visibilityOpen, setVisibilityOpen] = useState(false);

  if (isLoading) return <p className="text-sm text-text-secondary">Loading your holdings…</p>;
  if (error || !profile) {
    return <p className="text-sm text-negative">Couldn&apos;t load your profile.</p>;
  }

  const isPublic = profile.portfolio.isPublic;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => connectionId && syncNow.mutate(connectionId)}
            disabled={syncNow.isPending || !connectionId}
          >
            {syncNow.isPending ? "Syncing…" : "Sync now"}
          </Button>
          {connectionId && (
            <Button variant="ghost" onClick={() => setDisconnectOpen(true)}>
              Disconnect broker
            </Button>
          )}
        </div>
        <Button variant="secondary" onClick={() => setVisibilityOpen(true)}>
          {isPublic ? "Make private" : "Make public"}
        </Button>
      </div>

      <PortfolioProfileView profile={profile} isOwner />

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
  const { data: myPortfolio, isLoading: portfolioLoading, pollExhausted } = useMyPortfolio({
    pollWhilePending: true,
  });
  const { data: connections, isLoading: connectionsLoading } = useBrokerConnections();
  const initBroker = useInitBrokerConnection();

  if (portfolioLoading || connectionsLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-text-secondary">Loading your profile…</p>
      </div>
    );
  }

  // Phase 1 supports one broker at a time — the first connection is "the" one.
  const connection = connections?.[0] ?? null;

  if (!myPortfolio) {
    if (connection?.status === "expired") {
      return (
        <div className="mx-auto max-w-3xl px-4 py-10">
          <EmptyState
            title="Your broker connection needs to be reconnected"
            description="Your last sync didn't complete because the connection expired."
            action={
              <Button onClick={() => initBroker.mutate(UPSTOX)} disabled={initBroker.isPending}>
                {initBroker.isPending ? "Redirecting…" : "Reconnect"}
              </Button>
            }
          />
        </div>
      );
    }

    if (connection) {
      return (
        <div className="mx-auto max-w-3xl px-4 py-10">
          <EmptyState
            title="Syncing your portfolio…"
            description={
              pollExhausted
                ? "This is taking longer than expected. Check back shortly."
                : "Your broker connection is active — this usually takes a few seconds."
            }
          />
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState
          title="Connect a broker to get your verified profile"
          description="Nexarch reads your holdings directly from your broker, read-only. Nothing here executes trades or moves money."
          action={
            <Button onClick={() => initBroker.mutate(UPSTOX)} disabled={initBroker.isPending}>
              {initBroker.isPending ? "Redirecting…" : "Connect Broker"}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {connection?.status === "expired" && (
        <Card className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-text-primary">Your broker connection needs to be reconnected.</p>
          <Button variant="secondary" onClick={() => initBroker.mutate(UPSTOX)}>
            Reconnect
          </Button>
        </Card>
      )}

      <ConnectedProfile
        portfolioId={myPortfolio.id}
        connectionId={connection && connection.status !== "expired" ? connection.id : null}
      />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}
