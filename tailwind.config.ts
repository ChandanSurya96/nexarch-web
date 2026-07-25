import type { Config } from "tailwindcss";

// Color tokens mirror docs/design-system.md's color table exactly — the CSS
// custom properties are defined once in styles/globals.css, this just maps
// them into Tailwind class names (bg-surface, text-secondary, etc.) instead
// of components reaching for raw hex values.
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "bg-primary": "var(--bg-primary)",
        "bg-surface": "var(--bg-surface)",
        "bg-surface-hover": "var(--bg-surface-hover)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        positive: "var(--positive)",
        negative: "var(--negative)",
        border: "var(--border)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config;
