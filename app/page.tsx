"use client";

import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { ContentWidth } from "@/components/ui/Layout";
import { Eyebrow } from "@/components/ui/Metric";
import { PortfolioIdentityStrip } from "@/components/ui/PortfolioIdentityStrip";
import { Surface } from "@/components/ui/Surface";
import { useAuth } from "@/lib/auth/AuthProvider";

/**
 * An illustrative sector mix, used to show what a portfolio identity looks
 * like before a visitor has connected anything.
 *
 * Explicitly labelled as an example in the UI and deliberately carries no
 * returns, values, or named holdings — this is a shape, not a track record.
 * Nexarch's copy stays descriptive and never implies performance
 * (docs/security.md), and that constraint applies to the marketing surface
 * at least as much as to the product surface.
 */
const EXAMPLE_ALLOCATION = {
  Financials: 0.31,
  IT: 0.24,
  Consumer: 0.16,
  Healthcare: 0.12,
  Energy: 0.09,
  Industrials: 0.08,
};

const PRINCIPLES = [
  {
    title: "Verified, not claimed",
    body: "Holdings come from a read-only broker connection, so a profile reflects what someone actually owns rather than what they say they own.",
  },
  {
    title: "Described, never scored",
    body: "Diversification, concentration and consistency are shown as separate, individually explained indicators. There is no single rating, and nothing here ranks one investor above another.",
  },
  {
    title: "Read-only, by design",
    body: "Nexarch can see holdings and nothing else. It cannot place trades, move money, or act on an account.",
  },
];

export default function HomePage() {
  const { user, isLoading } = useAuth();

  return (
    <main id="main">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="pb-16 pt-16 sm:pb-24 sm:pt-24">
        <ContentWidth>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
            <div className="animate-rise">
              <Eyebrow>Portfolio identity for India</Eyebrow>
              <h1 className="mt-5 text-display-sm font-semibold tracking-tight text-text-primary sm:text-display lg:text-hero">
                Show your portfolio,
                <br />
                not your opinions.
              </h1>
              <p className="mt-6 max-w-xl text-body leading-relaxed text-text-secondary">
                Connect a brokerage account to build a verified investing profile, and browse other
                investors by what they hold — strategy, diversification and consistency — instead of
                by follower count.
              </p>

              {!isLoading && (
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link href="/discover">
                    <Button variant="primary" size="lg">
                      Browse investors
                    </Button>
                  </Link>
                  {user ? (
                    <Link href="/profile">
                      <Button variant="secondary" size="lg">
                        Go to your profile
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/register">
                      <Button variant="secondary" size="lg">
                        Create an account
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* The signature: a portfolio rendered as its own sector shape. This
              is the product's whole thesis stated visually — the identity is
              the composition. The same component, at the same colour mapping,
              appears on every card and profile in the app. */}
            <div className="animate-rise [animation-delay:120ms]">
              <Surface padding="lg">
                <div className="flex items-baseline justify-between gap-4">
                  <Eyebrow>Sector mix</Eyebrow>
                  <span className="text-caption text-text-tertiary">Illustrative example</span>
                </div>

                <div className="mt-5">
                  <PortfolioIdentityStrip
                    allocation={EXAMPLE_ALLOCATION}
                    label="Example portfolio sector mix"
                    variant="large"
                  />
                </div>

                <p className="mt-7 border-t border-border pt-5 text-body-sm leading-relaxed text-text-secondary">
                  Every profile carries this band. It is the portfolio&apos;s composition drawn to
                  scale, so two investors can be compared by shape before a single number is read.
                </p>
              </Surface>
            </div>
          </div>
        </ContentWidth>
      </section>

      {/* ── Principles ────────────────────────────────────────────────────── */}
      <section className="border-t border-border">
        <ContentWidth className="py-16 sm:py-20">
          <h2 className="text-title font-semibold text-text-primary">How Nexarch works</h2>
          <div className="stagger mt-10 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {PRINCIPLES.map((principle) => (
              <div key={principle.title} className="animate-rise">
                <h3 className="text-body font-medium text-text-primary">{principle.title}</h3>
                <p className="mt-2 text-body-sm leading-relaxed text-text-secondary">
                  {principle.body}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-14 max-w-3xl border-t border-border pt-6 text-caption leading-relaxed text-text-tertiary">
            Nexarch shows historical and descriptive portfolio data. Nothing on this platform is
            investment advice, a recommendation, or a prediction of future returns.
          </p>
        </ContentWidth>
      </section>
    </main>
  );
}
