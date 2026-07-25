"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

/** DELETE /broker-connections/:id — deletes the encrypted token immediately. */
export function useDisconnectBroker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (connectionId: string) =>
      apiFetch(`/broker-connections/${connectionId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brokerConnections"] });
    },
  });
}
