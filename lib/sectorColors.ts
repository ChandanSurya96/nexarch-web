/**
 * A sector should always render in the same color wherever it appears, so
 * users build pattern recognition across profiles — docs/design-system.md.
 */
const SECTOR_COLORS: Record<string, string> = {
  Financials: "#6C6CF2",
  IT: "#3DD68C",
  Consumer: "#F2C94C",
  Energy: "#F2994A",
  Healthcare: "#56CCF2",
  Industrials: "#BB6BD9",
  Materials: "#EB5757",
  Utilities: "#9B51E0",
  "Real Estate": "#27AE60",
  Other: "#9A9AA5",
};

const FALLBACK_COLORS = [
  "#6C6CF2",
  "#3DD68C",
  "#F2C94C",
  "#F2994A",
  "#56CCF2",
  "#BB6BD9",
  "#EB5757",
];

export function colorForSector(sector: string, indexIfUnknown: number): string {
  return SECTOR_COLORS[sector] ?? FALLBACK_COLORS[indexIfUnknown % FALLBACK_COLORS.length];
}
