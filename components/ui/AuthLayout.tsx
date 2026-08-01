import { ReactNode } from "react";

import { Surface } from "@/components/ui/Surface";

interface AuthLayoutProps {
  title: string;
  /** One line under the title. Keep it functional — this is not a landing page. */
  description?: string;
  children: ReactNode;
  /** The "already have an account?" line beneath the card. */
  footer?: ReactNode;
}

/**
 * The shell for login, register and the broker callback.
 *
 * These three pages had duplicated the same centred-column-plus-card markup
 * with slightly different padding and heading sizes each time. Extracting it
 * means the three most trust-sensitive screens in the product can't drift
 * apart, and it supplies the `<main id="main">` landmark the global skip link
 * targets.
 *
 * Deliberately spare: no illustration, no marketing copy, no social proof.
 * Someone typing a password into a finance product is looking for evidence
 * that the page is what it claims to be, and a busy layout reads as a phishing
 * page far more readily than a plain one does.
 */
export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-4 py-12"
    >
      <div className="animate-rise">
        <div className="mb-8 text-center">
          <h1 className="text-title font-semibold tracking-tight text-text-primary">{title}</h1>
          {description && (
            <p className="mt-2 text-body-sm leading-relaxed text-text-secondary">{description}</p>
          )}
        </div>

        <Surface padding="lg">{children}</Surface>

        {footer && (
          <div className="mt-6 text-center text-body-sm text-text-secondary">{footer}</div>
        )}
      </div>
    </main>
  );
}

interface FieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  /** Inline validation message, rendered next to the field it belongs to. */
  error?: string;
  hint?: string;
}

/**
 * A labelled form field.
 *
 * The label is a real `<label htmlFor>`, so clicking it focuses the control —
 * and the error is wired through `aria-describedby` by the caller passing the
 * same id, which is what makes an inline error audible rather than merely
 * visible.
 */
export function Field({ label, htmlFor, children, error, hint }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-body-sm font-medium text-text-primary">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-caption text-text-tertiary">{hint}</p>}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-caption text-negative">
          {error}
        </p>
      )}
    </div>
  );
}

/** The shared input styling, so the three auth forms can't diverge. */
export const inputClassName = [
  "w-full rounded-lg border border-border bg-bg-primary px-3 py-2.5",
  "text-body-sm text-text-primary placeholder:text-text-tertiary",
  // Explicit property list rather than `transition: all`.
  "transition-colors duration-base ease-out",
  "focus:border-accent-border focus:ring-0",
].join(" ");
