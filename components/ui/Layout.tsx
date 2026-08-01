import { ReactNode } from "react";

/**
 * Page composition primitives.
 *
 * Every page is built from these and nothing else. Before them, each route
 * hand-rolled its own shell — `max-w-5xl px-4 py-10` here, `max-w-3xl px-4
 * py-10` there, `min-h-screen justify-center` on the landing page — so no two
 * pages shared a column width or a vertical rhythm, and a change to page
 * padding meant editing every route. The point of this file is that page-level
 * spacing is no longer a per-page decision.
 */

type ContainerWidth = "narrow" | "default" | "wide";

const WIDTH_CLASSES: Record<ContainerWidth, string> = {
  // Reading-width, for auth forms and prose.
  narrow: "max-w-md",
  // The standard content column.
  default: "max-w-5xl",
  // Grids and dashboards that benefit from a third column.
  wide: "max-w-6xl",
};

interface PageContainerProps {
  children: ReactNode;
  width?: ContainerWidth;
  className?: string;
}

/**
 * The outer shell of every page: column width, horizontal gutter, vertical
 * rhythm, and the `#main` skip-link target. Renders `<main>`, so pages must
 * not nest another one.
 */
export function PageContainer({ children, width = "wide", className = "" }: PageContainerProps) {
  return (
    <main
      id="main"
      className={`mx-auto ${WIDTH_CLASSES[width]} px-4 py-10 sm:px-6 sm:py-14 ${className}`}
    >
      {children}
    </main>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Right-aligned controls — a sort control, a primary action. */
  actions?: ReactNode;
  /** Small label above the title, for context ("Comparing", a breadcrumb). */
  eyebrow?: ReactNode;
}

/**
 * The title block every page opens with.
 *
 * Page titles had drifted to 20px while the scale runs to 52px, so no page
 * announced itself and every screen opened at the same flat pitch. 40px here
 * is the "page title" step of the scale.
 */
export function PageHeader({ title, description, actions, eyebrow }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
      <div className="min-w-0 max-w-2xl">
        {eyebrow && <div className="mb-3">{eyebrow}</div>}
        <h1 className="text-display-sm font-semibold tracking-tight text-text-primary sm:text-display">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-body-sm leading-relaxed text-text-secondary">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}

interface PageSectionProps {
  children: ReactNode;
  /** Rendered as the section's heading via SectionTitle. */
  title?: string;
  /** Right-hand slot on the heading row — a count, a link. */
  titleAside?: ReactNode;
  className?: string;
}

/**
 * A titled band of content within a page. Owns the space *above* itself, so
 * sections stack with consistent rhythm without every page repeating a
 * margin utility.
 */
export function PageSection({ children, title, titleAside, className = "" }: PageSectionProps) {
  return (
    <section className={`mt-12 first:mt-10 ${className}`}>
      {title && <SectionTitle aside={titleAside}>{title}</SectionTitle>}
      {children}
    </section>
  );
}

interface SectionTitleProps {
  children: ReactNode;
  aside?: ReactNode;
}

/**
 * A section heading.
 *
 * Fixes an inverted hierarchy: section headings used to be
 * `text-sm text-text-secondary` — smaller *and* dimmer than the body text
 * they introduced — which made a long page read as one undifferentiated
 * column. Headings are now primary-coloured at the 24px step, with a hairline
 * rule carrying the separation instead of colour.
 */
export function SectionTitle({ children, aside }: SectionTitleProps) {
  return (
    <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-border pb-3">
      <h2 className="text-title font-semibold tracking-tight text-text-primary">{children}</h2>
      {aside && <div className="shrink-0 text-caption text-text-secondary">{aside}</div>}
    </div>
  );
}

/**
 * A horizontal rule between related blocks *inside* a section, where a full
 * SectionTitle would overstate the break. Presentational, so hidden from the
 * accessibility tree — a real `<hr>` announces a thematic break that this
 * isn't.
 */
export function SectionDivider({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`h-px w-full bg-border ${className}`} />;
}

/**
 * The content column *without* the `<main>` wrapper.
 *
 * For full-bleed pages whose bands need edge-to-edge backgrounds or rules
 * while their content still lines up with every other page — the landing page
 * is the only such layout today. Using PageContainer there would nest a second
 * `<main>`, and hand-rolling `mx-auto max-w-6xl px-4 sm:px-6` per band is
 * exactly the drift these primitives exist to stop.
 */
export function ContentWidth({
  children,
  width = "wide",
  className = "",
}: {
  children: ReactNode;
  width?: ContainerWidth;
  className?: string;
}) {
  return (
    <div className={`mx-auto ${WIDTH_CLASSES[width]} px-4 sm:px-6 ${className}`}>{children}</div>
  );
}
