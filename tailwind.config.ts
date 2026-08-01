import type { Config } from "tailwindcss";

// Color and type tokens mirror docs/design-system.md — the CSS custom
// properties are defined once in styles/globals.css, this just maps them into
// Tailwind class names (bg-surface, text-display, font-mono) instead of
// components reaching for raw hex values or one-off pixel sizes.
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "bg-primary": "var(--bg-primary)",
        "bg-surface": "var(--bg-surface)",
        "bg-surface-hover": "var(--bg-surface-hover)",
        "bg-raised": "var(--bg-raised)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        // Text colour for use ON an accent fill. --text-primary on --accent is
        // 3.81:1 and fails AA; this pairing is 4.74:1.
        "accent-on": "var(--accent-on)",
        // Accent as text on a dark surface (8.08:1). Not interchangeable with
        // `accent` — see globals.css.
        "accent-text": "var(--accent-text)",
        "accent-soft": "var(--accent-soft)",
        "accent-border": "var(--accent-border)",
        positive: "var(--positive)",
        negative: "var(--negative)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        // Figures, eyebrows and table numerals. In a portfolio-identity
        // product the disclosed numbers are the content, so they carry the
        // typographic personality rather than a decorative headline face.
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        caption: ["var(--text-caption)", { lineHeight: "1.4" }],
        "body-sm": ["var(--text-body-sm)", { lineHeight: "1.55" }],
        body: ["var(--text-body)", { lineHeight: "1.6" }],
        "title-sm": ["var(--text-title-sm)", { lineHeight: "1.35", letterSpacing: "-0.01em" }],
        title: ["var(--text-title)", { lineHeight: "1.25", letterSpacing: "-0.015em" }],
        "display-sm": ["var(--text-display-sm)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        display: ["var(--text-display)", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
        hero: ["var(--text-hero)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
      },
      transitionDuration: {
        fast: "var(--dur-fast)",
        base: "var(--dur-base)",
        slow: "var(--dur-slow)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config;
