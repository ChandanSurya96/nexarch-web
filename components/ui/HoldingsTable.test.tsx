import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HoldingsTable } from "@/components/ui/HoldingsTable";

type Holding = Parameters<typeof HoldingsTable>[0]["holdings"][number];

function holding(overrides: Partial<Holding> = {}): Holding {
  return {
    id: "h1",
    symbol: "BETA",
    exchange: "NSE",
    sector: "Pharma",
    quantity: "1263826",
    avgCostPrice: null,
    ...overrides,
  } as Holding;
}

describe("HoldingsTable value column", () => {
  it("hides the Value column when no holding has a cost basis", () => {
    // Public Investor Library portfolios: disclosures give quantities, never a
    // purchase price. Every cell would be an em dash, which reads as a broken
    // column rather than as absent data.
    render(<HoldingsTable holdings={[holding(), holding({ id: "h2", symbol: "SHAILY" })]} />);

    expect(screen.queryByRole("columnheader", { name: /value/i })).toBeNull();
    expect(screen.getByText(/public disclosures report quantities held/i)).toBeTruthy();
  });

  it("shows the Value column when at least one holding has a cost basis", () => {
    render(
      <HoldingsTable
        holdings={[holding({ avgCostPrice: "100" }), holding({ id: "h2", symbol: "SHAILY" })]}
      />
    );

    expect(screen.getByRole("columnheader", { name: /value/i })).toBeTruthy();
    // The explanatory note belongs only to the all-empty case.
    expect(screen.queryByText(/public disclosures report quantities held/i)).toBeNull();
    // The holding that genuinely has no cost basis still renders an em dash —
    // a mixed portfolio must not be silently reshaped.
    expect(screen.getAllByText("—").length).toBe(1);
  });

  it("separates symbol and exchange with real whitespace", () => {
    // `ml-1.5` spaces these visually but leaves no text node, so the cell's
    // textContent was "BETANSE" — what a screen reader announces and what a
    // user gets when they copy the symbol out.
    render(<HoldingsTable holdings={[holding()]} />);

    const cell = screen.getByRole("rowheader");
    expect(cell.textContent).toBe("BETA NSE");
  });
});
