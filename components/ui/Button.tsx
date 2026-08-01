"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

/**
 * Primary (accent-filled), secondary (outline), ghost (text-only) —
 * see docs/design-system.md "Core Components".
 */
type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  // text-accent-on (near-black) rather than text-primary: #F5F5F7 on #6C6CF2
  // measures 3.81:1 and fails WCAG AA at this size. This pairing is 4.74:1.
  // The primary button was the single most-used control in the product, so
  // this was the highest-traffic contrast failure of the three found.
  primary: "bg-accent text-accent-on hover:bg-accent-hover",
  secondary: "border border-border-strong text-text-primary hover:bg-bg-surface-hover",
  ghost: "text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-caption",
  // 40px tall — comfortably above the 24px minimum and close to the 44px
  // touch target the discovery feed needs on mobile.
  md: "h-10 px-4 text-body-sm",
  lg: "h-12 px-6 text-body-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className = "", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={[
        "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium",
        "transition-colors duration-base ease-out",
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Focus ring comes from the global :focus-visible rule in globals.css
        // so every control gets one, not just the ones that remembered to ask.
        sizeClasses[size],
        variantClasses[variant],
        className,
      ].join(" ")}
      {...props}
    />
  );
});
