"use client";

import { FormEvent, useState } from "react";

import { Fingerprint } from "@/components/landing/Fingerprint";
import { SECTORS_A } from "@/components/landing/data";
import { Container, Label, Reveal } from "@/components/landing/Primitives";

/**
 * "Early Development" — the waitlist.
 *
 * The form is the prototype's: it captures the address and swaps to a
 * confirmation. There is no endpoint behind it yet, which is why the button
 * says what it does and the confirmation promises nothing beyond contact.
 */
export function EarlyAccessSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (email) setSubmitted(true);
  }

  return (
    <section id="early-access" className="border-t border-l-border py-24 sm:py-32 lg:py-40">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[560px] text-center">
            <div className="mb-10 flex justify-center">
              <Fingerprint
                sectors={SECTORS_A}
                size={100}
                numRings={7}
                label="Portfolio fingerprint"
              />
            </div>

            <Label>Early Development</Label>

            <h2 className="mb-6 text-[clamp(2.2rem,4vw,3.2rem)] font-light leading-[1.2] tracking-[-0.02em] text-l-text">
              Being built
              <br />
              <span className="font-bold">carefully.</span>
            </h2>

            <p className="mb-4 text-base leading-[1.8] text-l-text-2">
              Nexarch is in active development. There are no fake user counts, no fabricated
              testimonials, and no investor logos placed here without their knowledge.
            </p>
            <p className="mb-12 text-base leading-[1.8] text-l-text-2">
              If you want a portfolio identity platform built with the same care you put into your
              investments — join the early access list. We will reach out when it&apos;s ready.
            </p>

            {submitted ? (
              <div
                // role="status" so the swap is announced; a visual-only change
                // leaves a screen-reader user unsure the submit worked.
                role="status"
                className="mx-auto flex max-w-[420px] items-center gap-3 rounded-lg border border-l-accent-20 bg-l-surface px-6 py-4"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M3 9l4.5 4.5 7.5-7.5" stroke="var(--l-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm text-l-text">
                  You&apos;re on the list. We&apos;ll be in touch.
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mx-auto flex max-w-[420px] flex-col gap-3 sm:flex-row"
              >
                <label htmlFor="early-access-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="early-access-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  spellCheck={false}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 rounded-lg border border-l-border bg-l-surface px-[18px] py-[13px] text-sm text-l-text transition-colors duration-200 placeholder:text-l-text-3 focus:border-l-accent focus:outline-none focus:ring-0"
                />
                <button
                  type="submit"
                  // text-l-accent-on, not the spec's #fff: white on the accent
                  // fill is 2.60:1 and fails AA.
                  className="rounded-lg bg-l-accent px-6 py-[13px] text-sm font-semibold text-l-accent-on transition-opacity duration-200 hover:opacity-85"
                >
                  Join Waitlist
                </button>
              </form>
            )}

            <p className="mt-5 font-mono text-[11px] tracking-[0.04em] text-l-text-3">
              No spam. No marketing. Just a notification when Nexarch is ready.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
