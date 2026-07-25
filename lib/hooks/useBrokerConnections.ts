"use client";

import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { BrokerConnection, BrokerConnectionResponse, toBrokerConnection } from "@/lib/types/portfolio";

/** GET /broker-connections — the caller's connections (usually zero or one, in Phase 1). */
export function useBrokerConnections() {
  return useQuery({
    queryKey: ["brokerConnections"],
    queryFn: async (): Promise<BrokerConnection[]> => {
      const data = await apiFetch<BrokerConnectionResponse[]>("/broker-connections");
      return data.map(toBrokerConnection);
    },
  });
}
