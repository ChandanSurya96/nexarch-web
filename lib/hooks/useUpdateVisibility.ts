"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

/** PATCH /portfolios/:id { is_public } — owner-only, private by default (ADR-011). */
export function useUpdateVisibility(portfolioId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isPublic: boolean) =>
      apiFetch(`/portfolios/${portfolioId}`, {
        method: "PATCH",
        body: JSON.stringify({ is_public: isPublic }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myPortfolio"] });
      queryClient.invalidateQueries({ queryKey: ["portfolioProfile", portfolioId] });
    },
  });
}
