"use client";

import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function HomePage() {
  const { user, isLoading } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Nexarch</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Portfolio identity and investor discovery for India — browse investors by strategy,
          diversification, and consistency, not follower count.
        </p>
      </div>

      {!isLoading && (
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/discover">
            <Button variant="primary">Discover Investors</Button>
          </Link>
          <Link href="/library">
            <Button variant="secondary">Public Investor Library</Button>
          </Link>
          {!user && (
            <Link href="/register">
              <Button variant="secondary">Register</Button>
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
