"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthProvider";

const LINKS = [
  { href: "/discover", label: "Discover" },
  { href: "/library", label: "Library" },
];

/**
 * The nav aligns to the same max-w-6xl column every page uses. It previously
 * sat at a bare px-4 while page content was centred in a narrower column, so
 * the wordmark drifted away from the content it belongs to on wide screens.
 *
 * Sticky with a blur so navigation stays reachable on the long portfolio
 * pages without permanently occupying vertical space.
 */
export function Nav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function linkClass(href: string) {
    return [
      // whitespace-nowrap because at 375px the five nav items are tight
      // enough that "Log out" was breaking mid-phrase onto two lines.
      "shrink-0 whitespace-nowrap rounded-md px-1.5 py-1 text-caption transition-colors",
      "duration-base ease-out sm:px-2 sm:text-body-sm",
      isActive(href) ? "text-text-primary" : "text-text-secondary hover:text-text-primary",
    ].join(" ");
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-bg-primary/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-0.5 sm:gap-3">
          <Link
            href="/"
            className="mr-1 shrink-0 whitespace-nowrap text-body-sm font-semibold tracking-tight text-text-primary sm:mr-3"
          >
            Nexarch
          </Link>
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(link.href)}
              // Announces the current page to screen readers — a colour change
              // alone communicates nothing to a non-visual user.
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
          {user ? (
            <>
              <Link
                href="/profile"
                className={linkClass("/profile")}
                aria-current={isActive("/profile") ? "page" : undefined}
              >
                Profile
              </Link>
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass("/login")}>
                Log in
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Create account
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
