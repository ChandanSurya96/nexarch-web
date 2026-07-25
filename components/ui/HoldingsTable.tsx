"use client";

import { useMemo, useState } from "react";

export interface Holding {
  id: string;
  symbol: string;
  exchange: string | null;
  quantity: string;
  avgCostPrice: string | null;
  sector: string | null;
}

type SortKey = "symbol" | "sector" | "quantity" | "value";
type SortDirection = "asc" | "desc";

function computeValue(holding: Holding): number | null {
  if (holding.avgCostPrice === null) return null;
  return Number(holding.quantity) * Number(holding.avgCostPrice);
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

/** Tabular-nums, client-side sortable, sticky header — docs/design-system.md. */
export function HoldingsTable({ holdings }: { holdings: Holding[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("symbol");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sorted = useMemo(() => {
    const rows = holdings.map((holding) => ({ holding, value: computeValue(holding) }));
    const factor = sortDirection === "asc" ? 1 : -1;
    return rows.sort((a, b) => {
      switch (sortKey) {
        case "symbol":
          return factor * a.holding.symbol.localeCompare(b.holding.symbol);
        case "sector":
          return factor * (a.holding.sector ?? "").localeCompare(b.holding.sector ?? "");
        case "quantity":
          return factor * (Number(a.holding.quantity) - Number(b.holding.quantity));
        case "value":
          return factor * ((a.value ?? -Infinity) - (b.value ?? -Infinity));
      }
    });
  }, [holdings, sortKey, sortDirection]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  }

  function headerButton(key: SortKey, label: string, align: "left" | "right") {
    const active = key === sortKey;
    return (
      <button
        type="button"
        onClick={() => toggleSort(key)}
        className={`flex items-center gap-1 text-xs font-medium uppercase tracking-wide ${
          align === "right" ? "ml-auto" : ""
        } ${active ? "text-text-primary" : "text-text-secondary"}`}
      >
        {label}
        {active && <span aria-hidden="true">{sortDirection === "asc" ? "↑" : "↓"}</span>}
      </button>
    );
  }

  if (holdings.length === 0) {
    return <p className="text-sm text-text-secondary">No holdings synced yet.</p>;
  }

  return (
    <div className="max-h-[28rem] overflow-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-bg-surface">
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left">{headerButton("symbol", "Symbol", "left")}</th>
            <th className="px-4 py-3 text-left">{headerButton("sector", "Sector", "left")}</th>
            <th className="px-4 py-3 text-right">{headerButton("quantity", "Quantity", "right")}</th>
            <th className="px-4 py-3 text-right">{headerButton("value", "Value", "right")}</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(({ holding, value }) => (
            <tr key={holding.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3 font-medium text-text-primary">
                {holding.symbol}
                {holding.exchange && (
                  <span className="ml-1.5 text-xs font-normal text-text-secondary">
                    {holding.exchange}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-text-secondary">{holding.sector ?? "—"}</td>
              <td className="px-4 py-3 text-right tabular-nums text-text-primary">
                {formatNumber(Number(holding.quantity))}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-text-primary">
                {value !== null ? `₹${formatNumber(value)}` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
