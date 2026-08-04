import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "A verified portfolio's holdings, allocation and health indicators.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
