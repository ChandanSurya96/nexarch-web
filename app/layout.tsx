import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";

import "../styles/globals.css";
import { Nav } from "@/components/Nav";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// The display face, used only for figures, eyebrow labels and table numerals.
// Weights are pinned to the three actually used (regular / medium / semibold)
// so the mono face doesn't cost more than the prose face it accompanies.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexarch — Portfolio Identity for Indian Investors",
  description:
    "Connect your brokerage account to generate a verified investing profile. " +
    "Browse investors by strategy, diversification, and consistency — not follower count.",
};

// Matches --bg-primary, so mobile browser chrome blends with the page instead
// of framing it in a default light bar.
export const viewport: Viewport = {
  themeColor: "#0b0b0e",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plexMono.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
          {/* Keyboard and screen-reader users shouldn't have to walk the nav on
              every page to reach the content. */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-body-sm focus:font-medium focus:text-accent-on"
          >
            Skip to content
          </a>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
