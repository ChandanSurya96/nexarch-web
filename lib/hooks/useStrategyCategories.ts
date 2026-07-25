"use client";

import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import {
  StrategyCategory,
  StrategyCategoryResponse,
  toStrategyCategory,
} from "@/lib/types/discovery";

/** GET /discovery/strategy-categories — used for the Discovery Feed's filter chips. */
export function useStrategyCategories() {
  return useQuery({
    queryKey: ["strategyCategories"],
    queryFn: async (): Promise<StrategyCategory[]> => {
      const data = await apiFetch<StrategyCategoryResponse[]>("/discovery/strategy-categories");
      return data.map(toStrategyCategory);
    },
  });
}
