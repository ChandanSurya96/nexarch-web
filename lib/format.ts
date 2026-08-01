/**
 * One place for every number, currency and date the UI renders.
 *
 * Currency was previously built by concatenating a rupee glyph onto
 * `toLocaleString` in three separate components (`₹${v.toLocaleString(...)}`).
 * That hardcodes both the symbol and its position, which `Intl.NumberFormat`
 * already knows how to do correctly — and it drifted, with two of the three
 * call sites using different fraction-digit settings for the same kind of
 * value.
 *
 * Formatters are module-level constants because constructing an
 * `Intl.NumberFormat` is comparatively expensive and these run once per table
 * cell — a holdings table rebuilds them for every row otherwise.
 */

const LOCALE = "en-IN";

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

/** Whole rupees — for axis ticks and headline values where paise are noise. */
const currencyCompactFormatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const quantityFormatter = new Intl.NumberFormat(LOCALE, {
  maximumFractionDigits: 2,
});

// minimum === maximum so every percentage renders one decimal place, always.
// With only maximumFractionDigits, Intl drops trailing zeros ("14%" for 0.14
// but "14.2%" for 0.142), which breaks decimal-point alignment in a column of
// figures — the reason these are set in a tabular face to begin with.
const percentFormatter = new Intl.NumberFormat(LOCALE, {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatCurrencyWhole(value: number): string {
  return currencyCompactFormatter.format(value);
}

export function formatQuantity(value: number): string {
  return quantityFormatter.format(value);
}

/** Takes a 0–1 ratio, not an already-multiplied percentage. */
export function formatPercent(ratio: number): string {
  return percentFormatter.format(ratio);
}

/** Signed, for figures where direction carries meaning (momentum). */
export function formatSignedPercent(ratio: number): string {
  const formatted = percentFormatter.format(Math.abs(ratio));
  if (ratio > 0) return `+${formatted}`;
  if (ratio < 0) return `−${formatted}`; // U+2212 minus, not a hyphen
  return formatted;
}

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return dateFormatter.format(date);
}

/** Unitless index (diversification, HHI) — two decimals, always. */
export function formatRatio(value: number): string {
  return value.toFixed(2);
}

/** Day counts, e.g. portfolio age. */
export function formatDays(value: number): string {
  return `${quantityFormatter.format(value)}d`;
}

/** Plain integer counts — holdings, positions. */
export function formatCount(value: number): string {
  return quantityFormatter.format(value);
}
