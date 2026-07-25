"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

/** POST/DELETE /portfolios/:id/follow — never moves money or places an order. */
export function useFollow(portfolioId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiFetch(`/portfolios/${portfolioId}/follow`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followingIds"] });
    },
  });
}

export function useUnfollow(portfolioId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiFetch(`/portfolios/${portfolioId}/follow`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followingIds"] });
    },
  });
}
