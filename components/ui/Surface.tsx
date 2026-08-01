import { HTMLAttributes, ReactNode } from "react";

/**
 * Surface primitives — the panels everything sits on.
 *
 * `Surface` is the single source of the card look (radius, border, elevation).
 * `Card` is kept as a thin alias so existing imports keep working, and
 * `DataCard` adds the title/aside header that most analytics panels repeated
 * by hand.
 */

type SurfaceTone = "default" | "raised" | "quiet";

const TONE_CLASSES: Record<SurfaceTone, string> = {
  default: "border-border bg-bg-surface",
  /** Sits on top of another surface — comparison columns, modal bodies. */
  raised: "border-border-strong bg-bg-raised",
  /** Recedes: for supporting panels that shouldn't compete with the content. */
  quiet: "border-border bg-bg-surface/40",
};

type SurfacePadding = "none" | "sm" | "md" | "lg";

const PADDING_CLASSES: Record<SurfacePadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6 sm:p-8",
};

interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  tone?: SurfaceTone;
  padding?: SurfacePadding;
  /** Hover feedback. Only for surfaces that are themselves a link or button —
   *  a hover state on a static panel promises an interaction that isn't there. */
  interactive?: boolean;
}

export function Surface({
  tone = "default",
  padding = "md",
  interactive = false,
  className = "",
  ...props
}: SurfaceProps) {
  return (
    <div
      className={[
        "rounded-xl border",
        TONE_CLASSES[tone],
        PADDING_CLASSES[padding],
        interactive
          ? // Explicit property list, never `transition: all` — that would
            // animate layout properties too and cost a compositor promotion.
            "transition-colors duration-base ease-out hover:border-border-strong hover:bg-bg-surface-hover"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

interface DataCardProps {
  title: string;
  /** Right-hand slot on the header row — a unit, a timestamp, a control. */
  aside?: ReactNode;
  children: ReactNode;
  tone?: SurfaceTone;
  className?: string;
}

/**
 * A titled panel for a block of data — a chart, a table, a set of rows.
 *
 * The header is an `<h3>`, which keeps the document outline intact when these
 * sit inside a `PageSection`'s `<h2>`.
 */
export function DataCard({
  title,
  aside,
  children,
  tone = "default",
  className = "",
}: DataCardProps) {
  return (
    <Surface tone={tone} padding="none" className={className}>
      <div className="flex items-baseline justify-between gap-4 border-b border-border px-5 py-4">
        <h3 className="text-title-sm font-medium tracking-tight text-text-primary">{title}</h3>
        {aside && <div className="shrink-0 text-caption text-text-secondary">{aside}</div>}
      </div>
      <div className="p-5">{children}</div>
    </Surface>
  );
}

interface InfoRowProps {
  label: ReactNode;
  value: ReactNode;
  /** Explanatory text under the label, for metrics that need defining. */
  hint?: string;
}

/**
 * A label/value pair on one line — the workhorse of detail panels.
 *
 * Uses a definition list internally so the label/value relationship is real
 * markup rather than visual adjacency, which is what a screen reader needs to
 * pair them correctly. `min-w-0` on the label lets long labels truncate
 * instead of pushing the value off the row.
 */
export function InfoRow({ label, value, hint }: InfoRowProps) {
  return (
    <div className="flex items-start justify-between gap-6 py-3">
      <div className="min-w-0">
        <dt className="text-body-sm text-text-secondary">{label}</dt>
        {hint && <p className="mt-0.5 text-caption leading-snug text-text-tertiary">{hint}</p>}
      </div>
      <dd className="shrink-0 text-right text-body-sm font-medium text-text-primary">{value}</dd>
    </div>
  );
}

/** Wraps a set of InfoRows. Required — <dt>/<dd> must have a <dl> parent. */
export function InfoList({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <dl className={`divide-y divide-border ${className}`}>{children}</dl>;
}
