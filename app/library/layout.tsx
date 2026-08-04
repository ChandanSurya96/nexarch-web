import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Public investor library",
  description: "Educational profiles built from public shareholding disclosures.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
