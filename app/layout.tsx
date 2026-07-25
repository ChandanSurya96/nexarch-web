import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "../styles/globals.css";
import { Nav } from "@/components/Nav";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Nexarch — Portfolio Identity for Indian Investors",
  description:
    "Connect your brokerage account to generate a verified investing profile. " +
    "Browse investors by strategy, diversification, and consistency — not follower count.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
