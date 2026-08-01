"use client";

import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, formatQuantity } from "@/lib/format";
import { colorForSector } from "@/lib/sectorColors";

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

/** Tabular-nums, client-side sortable, sticky header — docs/design-system.md. */
export function HoldingsTable({ holdings }: { holdings: Holding[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("symbol");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sorted = useMemo(() => {
    const rows = holdings.map((holding) => ({
      holding,
      value: computeValue(holding),
    }));
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

  /**
   * A sortable column header.
   *
   * aria-sort is what makes this usable without sight — previously the only
   * indication of sort state was an aria-hidden arrow, so a screen-reader user
   * could activate the control but never learn what it did.
   */
  function SortableHeader({
    columnKey,
    label,
    align = "left",
  }: {
    columnKey: SortKey;
    label: string;
    align?: "left" | "right";
  }) {
    const active = columnKey === sortKey;
    return (
      <th
        scope="col"
        className={`px-4 py-3 ${align === "right" ? "text-right" : "text-left"}`}
        aria-sort={active ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
      >
        <button
          type="button"
          onClick={() => toggleSort(columnKey)}
          className={[
            "inline-flex items-center gap-1 rounded font-mono text-caption font-medium uppercase tracking-[0.08em]",
            "transition-colors duration-base ease-out hover:text-text-primary",
            align === "right" ? "flex-row-reverse" : "",
            active ? "text-text-primary" : "text-text-tertiary",
          ].join(" ")}
        >
          {label}
          <span aria-hidden="true" className={active ? "opacity-100" : "opacity-0"}>
            {sortDirection === "asc" ? "↑" : "↓"}
          </span>
        </button>
      </th>
    );
  }

  if (holdings.length === 0) {
    return (
      <EmptyState
        title="No holdings yet"
        description="Holdings appear here once a broker connection has completed its first sync."
      />
    );
  }

  return (
    // overflow-x-auto so the table scrolls inside its own container on mobile
    // rather than forcing the whole page sideways.
    <div className="max-h-[28rem] overflow-auto rounded-xl border border-border">
      <table className="w-full min-w-[34rem] text-body-sm">
        <caption className="sr-only">
          Holdings, sortable by symbol, sector, quantity and value
        </caption>
        <thead className="sticky top-0 z-10 bg-bg-surface">
          <tr className="border-b border-border-strong">
            <SortableHeader columnKey="symbol" label="Symbol" />
            <SortableHeader columnKey="sector" label="Sector" />
            <SortableHeader columnKey="quantity" label="Qty" align="right" />
            <SortableHeader columnKey="value" label="Value" align="right" />
          </tr>
        </thead>
        <tbody>
          {sorted.map(({ holding, value }, index) => (
            <tr
              key={holding.id}
              className="border-b border-border transition-colors duration-fast ease-out last:border-0 hover:bg-bg-surface-hover"
            >
              <th scope="row" className="px-4 py-3 text-left font-medium text-text-primary">
                {holding.symbol}
                {holding.exchange && (
                  <span className="ml-1.5 font-mono text-caption font-normal text-text-tertiary">
                    {holding.exchange}
                  </span>
                )}
              </th>
              <td className="px-4 py-3 text-text-secondary">
                {holding.sector ? (
                  // The same colour this sector takes in the fingerprint and
                  // the donut, so the three views reinforce each other rather
                  // than each teaching a separate legend.
                  <span className="inline-flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{
                        backgroundColor: colorForSector(holding.sector, index),
                      }}
                    />
                    {holding.sector}
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3 text-right font-mono text-text-primary">
                {formatQuantity(Number(holding.quantity))}
              </td>
              <td className="px-4 py-3 text-right font-mono text-text-primary">
                {value !== null ? formatCurrency(value) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
