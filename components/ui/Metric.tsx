import { ReactNode } from "react";

import { Surface } from "@/components/ui/Surface";

/**
 * Numeric display primitives.
 *
 * Every figure in the product goes through `Metric` so the mono face, tabular
 * figures and weight stay consistent — a portfolio value set one way on the
 * dashboard and another in a table is the drift that makes a data product feel
 * unmaintained. `tabular-nums` comes from the `.font-mono` rule in globals.css,
 * so digits never reflow as values change on sync.
 */

type MetricSize = "sm" | "md" | "lg" | "xl";

const SIZE_CLASSES: Record<MetricSize, string> = {
  sm: "text-body-sm",
  md: "text-title-sm",
  lg: "text-display-sm",
  xl: "text-display",
};

type MetricTone = "neutral" | "positive" | "negative";

const TONE_CLASSES: Record<MetricTone, string> = {
  neutral: "text-text-primary",
  positive: "text-positive",
  negative: "text-negative",
};

interface MetricProps {
  /** Pre-formatted for display — use lib/format.ts, not ad-hoc concatenation. */
  value: string;
  size?: MetricSize;
  /**
   * Directional colouring. Leave neutral for portfolio-health indicators:
   * "higher" isn't consistently good or bad across them, and colouring them
   * would smuggle in the ranking judgment ADR-007 exists to avoid.
   */
  tone?: MetricTone;
  className?: string;
}

export function Metric({ value, size = "md", tone = "neutral", className = "" }: MetricProps) {
  return (
    <span
      className={`font-mono font-medium ${SIZE_CLASSES[size]} ${TONE_CLASSES[tone]} ${className}`}
    >
      {value}
    </span>
  );
}

/**
 * The small uppercase label above a metric. Set in the mono face so label and
 * value read as one unit — the label is part of the data, not prose about it.
 */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`font-mono text-caption font-medium uppercase tracking-[0.08em] text-text-tertiary ${className}`}
    >
      {children}
    </p>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  description?: string;
  tone?: MetricTone;
}

/**
 * A single labelled metric — deliberately not styled as a score. There is no
 * composite "trust score" in Nexarch (ADR-007); each health indicator is shown
 * and explained independently.
 */
export function StatCard({ label, value, description, tone = "neutral" }: StatCardProps) {
  return (
    <Surface padding="sm">
      <Eyebrow>{label}</Eyebrow>
      <Metric value={value} size="lg" tone={tone} className="mt-2 block" />
      {description && (
        <p className="mt-1.5 text-caption leading-snug text-text-tertiary">{description}</p>
      )}
    </Surface>
  );
}
