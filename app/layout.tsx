import type { Metadata } from "next";
import "../styles/globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
