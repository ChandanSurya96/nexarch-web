"use client";

import { useMutation } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

interface InitBrokerConnectionResponse {
  redirect_url: string;
}

export const PENDING_BROKER_NAME_KEY = "nexarch:pendingBrokerName";

/**
 * POST /broker-connections/init, then a full-page redirect to the broker's
 * real login page — this is an external OAuth hop, not client-side routing.
 * The broker name is stashed in sessionStorage so /broker-callback knows
 * which adapter's callback to call (the redirect carries no state param yet).
 */
export function useInitBrokerConnection() {
  return useMutation({
    mutationFn: async (brokerName: string) => {
      const { redirect_url: redirectUrl } = await apiFetch<InitBrokerConnectionResponse>(
        "/broker-connections/init",
        {
          method: "POST",
          body: JSON.stringify({ broker_name: brokerName }),
        }
      );
      sessionStorage.setItem(PENDING_BROKER_NAME_KEY, brokerName);
      window.location.href = redirectUrl;
    },
  });
}
