"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { colorForSector } from "@/lib/sectorColors";

interface AllocationChartProps {
  title: string;
  allocation: Record<string, number>;
}

/**
 * Recharts donut for sector/asset allocation, always paired with a
 * visually-hidden data table — a chart alone communicates nothing to a
 * non-visual user (docs/design-system.md "Accessibility").
 */
export function AllocationChart({ title, allocation }: AllocationChartProps) {
  const entries = Object.entries(allocation).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    return <p className="text-sm text-text-secondary">Not enough data yet.</p>;
  }

  const data = entries.map(([sector, weight]) => ({ sector, weight }));

  return (
    <div>
      <div className="h-64 w-full" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="weight"
              nameKey="sector"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={entry.sector} fill={colorForSector(entry.sector, index)} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => (typeof value === "number" ? `${(value * 100).toFixed(1)}%` : value)}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th>Sector</th>
            <th>Allocation</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ sector, weight }) => (
            <tr key={sector}>
              <td>{sector}</td>
              <td>{(weight * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="mt-3 flex flex-wrap gap-3" aria-hidden="true">
        {data.map((entry, index) => (
          <li key={entry.sector} className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: colorForSector(entry.sector, index) }}
            />
            {entry.sector} ({(entry.weight * 100).toFixed(0)}%)
          </li>
        ))}
      </ul>
    </div>
  );
}
