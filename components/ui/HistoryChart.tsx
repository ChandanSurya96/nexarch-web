"use client";

import { formatCurrencyWhole } from "@/lib/format";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PortfolioHistoryEntry } from "@/lib/types/history";

interface HistoryChartProps {
  entries: PortfolioHistoryEntry[];
}

function formatValue(value: number): string {
  return formatCurrencyWhole(value);
}

/** Portfolio value over time (Milestone 5) — same accessible-table pattern as AllocationChart. */
export function HistoryChart({ entries }: HistoryChartProps) {
  const data = entries
    .filter(
      (entry): entry is PortfolioHistoryEntry & { totalValue: number } => entry.totalValue !== null,
    )
    .map((entry) => ({ date: entry.snapshotDate, value: entry.totalValue }));

  if (data.length < 2) return null;

  return (
    <div>
      <div className="h-56 w-full" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="var(--text-secondary)" />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="var(--text-secondary)"
              width={70}
              tickFormatter={(value: number) => formatValue(value)}
            />
            <Tooltip
              formatter={(value) => (typeof value === "number" ? formatValue(value) : value)}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--accent)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <table className="sr-only">
        <caption>Portfolio value over time</caption>
        <thead>
          <tr>
            <th>Date</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((point) => (
            <tr key={point.date}>
              <td>{point.date}</td>
              <td>{formatValue(point.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
