"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

/**
 * Primary (accent-filled), secondary (outline), ghost (text-only) —
 * see docs/design-system.md "Core Components".
 */
type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-text-primary hover:bg-accent-hover",
  secondary: "border border-border text-text-primary hover:bg-bg-surface-hover",
  ghost: "text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", className = "", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={[
        "inline-flex items-center justify-center rounded-md px-4 py-2",
        "text-sm font-medium transition-colors duration-150",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
        variantClasses[variant],
        className,
      ].join(" ")}
      {...props}
    />
  );
});
