import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Inter } from "next/font/google";

import "../styles/globals.css";
import "../styles/landing.css";
import { SiteNav } from "@/components/SiteNav";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// The landing page's body face (Figma spec). Only the weights the design
// actually uses, so the marketing page doesn't ship six unused files.
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

// Figures, eyebrow labels and table numerals — used by both the product and
// the landing page. Weights pinned to the three actually used.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  // `template` lets each route set only its own name — every product page then
  // reads "<Page> — Nexarch" in the tab, browser history and bookmarks. Before
  // this, all nine routes shared one title, so a user with several tabs open
  // (the comparison flow actively encourages that) could not tell them apart,
  // and screen readers announced the same string on every navigation.
  title: {
    default: "Nexarch — Portfolio Identity for Indian Investors",
    template: "%s — Nexarch",
  },
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
    <html lang="en" className={`${inter.variable} ${plexSans.variable} ${plexMono.variable}`}>
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
          <SiteNav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
