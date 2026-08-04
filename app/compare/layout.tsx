import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Compare portfolios",
  description: "Two portfolios side by side — descriptive facts, no ranking.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
