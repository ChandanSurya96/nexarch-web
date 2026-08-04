import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a Nexarch account and generate a verified portfolio identity.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
