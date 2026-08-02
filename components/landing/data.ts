import type { Sector } from "@/components/landing/Fingerprint";

/**
 * Landing-page content, verbatim from the Figma spec unless noted.
 *
 * Held in one module so a section component stays a layout concern and the
 * copy can be reviewed in one place — which matters on a page that sits close
 * to the SEBI advisory line.
 */

export const SECTORS_A: Sector[] = [
  { name: "Technology", weight: 0.28 },
  { name: "Financial Services", weight: 0.18 },
  { name: "Healthcare", weight: 0.15 },
  { name: "Consumer Goods", weight: 0.12 },
  { name: "Energy", weight: 0.1 },
  { name: "Industrials", weight: 0.08 },
  { name: "Real Estate", weight: 0.06 },
  { name: "Others", weight: 0.03 },
];

export const SECTORS_B: Sector[] = [
  { name: "Technology", weight: 0.11 },
  { name: "Financial Services", weight: 0.35 },
  { name: "Healthcare", weight: 0.08 },
  { name: "Consumer Goods", weight: 0.24 },
  { name: "Energy", weight: 0.06 },
  { name: "Industrials", weight: 0.1 },
  { name: "Real Estate", weight: 0.04 },
  { name: "Others", weight: 0.02 },
];

const weights = (...w: number[]): Sector[] =>
  w.map((weight, i) => ({ name: SECTORS_A[i]?.name ?? "Others", weight }));

export interface DiscoveryPortfolio {
  id: number;
  name: string;
  cagr: string;
  stocks: number;
  years: number;
  sectors: Sector[];
  tags: string[];
  topSector: string;
}

export const DISCOVERY_PORTFOLIOS: DiscoveryPortfolio[] = [
  { id: 1, name: "Arjun S.", cagr: "22.4%", stocks: 24, years: 5, sectors: weights(0.28, 0.18, 0.15, 0.12, 0.1, 0.08, 0.06, 0.03), tags: ["tech-heavy", "cagr-20"], topSector: "Technology 28%" },
  { id: 2, name: "Priya M.", cagr: "18.1%", stocks: 38, years: 8, sectors: weights(0.11, 0.35, 0.08, 0.24, 0.06, 0.1, 0.04, 0.02), tags: ["diversified"], topSector: "Financials 35%" },
  { id: 3, name: "Rahul K.", cagr: "31.2%", stocks: 12, years: 3, sectors: weights(0.42, 0.1, 0.2, 0.08, 0.06, 0.07, 0.05, 0.02), tags: ["tech-heavy", "cagr-20"], topSector: "Technology 42%" },
  { id: 4, name: "Ananya T.", cagr: "14.8%", stocks: 51, years: 11, sectors: weights(0.14, 0.22, 0.12, 0.28, 0.08, 0.09, 0.05, 0.02), tags: ["diversified", "10-yrs"], topSector: "Consumer 28%" },
  { id: 5, name: "Dev N.", cagr: "11.6%", stocks: 29, years: 14, sectors: weights(0.08, 0.18, 0.06, 0.14, 0.3, 0.16, 0.06, 0.02), tags: ["10-yrs", "diversified"], topSector: "Energy 30%" },
  { id: 6, name: "Meera P.", cagr: "28.9%", stocks: 16, years: 4, sectors: weights(0.12, 0.1, 0.38, 0.16, 0.08, 0.07, 0.06, 0.03), tags: ["cagr-20"], topSector: "Healthcare 38%" },
];

export const FILTER_TAGS = [
  { id: "all", label: "All Portfolios" },
  { id: "tech-heavy", label: "Tech Heavy" },
  { id: "cagr-20", label: "CAGR 20%+" },
  { id: "10-yrs", label: "10+ Years" },
  { id: "diversified", label: "Diversified" },
];

/**
 * Public Investor Library rows.
 *
 * DEVIATION FROM THE FIGMA FILE, and the only content change on this page.
 *
 * The spec populated this table with real, named public figures — including
 * the sitting SEBI Chairperson — each paired with an invented filing
 * reference (`SEBI/MDB/2024/031` and similar), under copy reading "Not
 * curated. Not summarized. Primary sources." Those reference numbers do not
 * exist. Publishing fabricated regulatory identifiers against a named
 * regulator, on the site of a company that regulator supervises, is a real
 * exposure and not something a layout should carry.
 *
 * The structure, column widths, type and hover behaviour are unchanged; only
 * the attributions are now unmistakably fictional, and the block is marked as
 * sample data. Swap this array for genuine indexed filings and the section
 * needs no other edit.
 */
export const PUBLIC_DISCLOSURES = [
  { date: "Mar 2024", name: "A. Sample", role: "Promoter, Example Industries Ltd.", type: "Mandatory Disclosure", id: "SAMPLE/001" },
  { date: "Jan 2024", name: "B. Placeholder", role: "Director, Specimen Corp.", type: "Quarterly Filing Q4 FY24", id: "SAMPLE/002" },
  { date: "Oct 2023", name: "C. Illustrative", role: "Public Investor", type: "Quarterly Disclosure Q3 2023", id: "SAMPLE/003" },
  { date: "Aug 2023", name: "D. Demonstration", role: "Promoter, Model Retail Ltd.", type: "Shareholding Disclosure", id: "SAMPLE/004" },
  { date: "May 2023", name: "E. Exemplar", role: "Sample Asset Management", type: "Fund Holdings Disclosure", id: "SAMPLE/005" },
];

export const PHILOSOPHY_POINTS = [
  "A cryptographically verified snapshot of your actual holdings",
  "A sector fingerprint unique to your allocation",
  "A track record that cannot be edited, curated, or exaggerated",
];
