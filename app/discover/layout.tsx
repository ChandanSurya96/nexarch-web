import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Discover investors",
  description: "Browse verified and public portfolios by strategy, diversification and consistency.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
