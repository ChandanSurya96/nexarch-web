import { HTMLAttributes } from "react";

/** Small and subtle by design — never a gamification reward. docs/design-system.md. */
type BadgeVariant = "verified" | "public" | "tag";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  verified: "border border-accent text-accent",
  public: "border border-border text-text-secondary",
  tag: "bg-bg-surface-hover text-text-secondary",
};

export function Badge({ variant = "tag", className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
