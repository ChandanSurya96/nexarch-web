"use client";

import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthProvider";

export function Nav() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between border-b border-border px-4 py-3">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-sm font-semibold text-text-primary">
          Nexarch
        </Link>
        <Link href="/discover" className="text-sm text-text-secondary hover:text-text-primary">
          Discover
        </Link>
        <Link href="/library" className="text-sm text-text-secondary hover:text-text-primary">
          Library
        </Link>
      </div>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link href="/profile" className="text-sm text-text-secondary hover:text-text-primary">
              Profile
            </Link>
            <Button variant="ghost" onClick={() => logout()}>
              Log out
            </Button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary">
              Log in
            </Link>
            <Link href="/register">
              <Button variant="secondary">Register</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
