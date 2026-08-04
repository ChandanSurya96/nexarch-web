import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Your profile",
  description: "Your portfolio, broker connection and visibility settings.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
