"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

/** POST /broker-connections/:id/sync — manual "sync now", cooldown-limited server-side. */
export function useSyncNow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (connectionId: string) =>
      apiFetch(`/broker-connections/${connectionId}/sync`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brokerConnections"] });
      queryClient.invalidateQueries({ queryKey: ["myPortfolio"] });
    },
  });
}
