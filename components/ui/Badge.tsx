import { HTMLAttributes } from "react";

/** Small and subtle by design — never a gamification reward. docs/design-system.md. */
type BadgeVariant = "verified" | "public" | "tag";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  // text-accent-text, not text-accent: #6C6CF2 on --bg-surface measures
  // 4.39:1, which fails WCAG AA for text this small. #A5A5F8 is 8.08:1.
  // The verified badge is a trust signal — it has to be readable to work.
  verified: "border border-accent-border bg-accent-soft text-accent-text",
  public: "border border-border-strong text-text-secondary",
  tag: "bg-bg-surface-hover text-text-secondary",
};

export function Badge({ variant = "tag", className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-caption font-medium ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
