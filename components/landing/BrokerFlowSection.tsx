"use client";

import { m, useReducedMotion } from "framer-motion";

import { Fingerprint } from "@/components/landing/Fingerprint";
import { SECTORS_A } from "@/components/landing/data";
import { Band, Label, Reveal } from "@/components/landing/Primitives";

const STEPS = [
  { id: "broker", label: "Connect Broker", desc: "Zerodha, Groww, Upstox, or Angel One. OAuth-secured, read-only." },
  { id: "perm", label: "Grant Read Access", desc: "You authorize read-only access. Nexarch cannot place orders or transfer funds." },
  { id: "encrypt", label: "TLS + End-to-End", desc: "All data flows over encrypted channels. Nothing is stored in plain text." },
  { id: "import", label: "Portfolio Imported", desc: "Holdings, quantities, and cost basis are imported directly from your broker." },
  { id: "verify", label: "Cross-referenced", desc: "Holdings are verified against exchange records and ISIN data." },
  { id: "identity", label: "Identity Generated", desc: "Your unique Portfolio Fingerprint is computed and sealed with a timestamp." },
];

/**
 * "Broker Verification" — the connection sequence, drawn as a timeline whose
 * accent rail grows top-to-bottom as the section enters.
 *
 * This is the one place on the page where numbered markers are correct: the
 * steps are a genuine sequence, and their order carries meaning.
 */
export function BrokerFlowSection() {
  const reduceMotion = useReducedMotion();
  const lastIndex = STEPS.length - 1;

  return (
    <Band>
      <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-24">
        <Reveal>
          <Label>Broker Verification</Label>
          <h2 className="mb-5 text-[clamp(2rem,3vw,2.8rem)] font-light leading-[1.2] tracking-[-0.02em] text-l-text">
            Watch a secure identity
            <br />
            assemble itself.
          </h2>
          <p className="max-w-[400px] text-base leading-[1.8] text-l-text-2">
            No manual entry. No uploaded screenshots. Your broker is the only source of truth, and
            we connect directly to it.
          </p>
        </Reveal>

        <m.ol
          className="relative pl-1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } } }}
        >
          {/* Rail. The accent overlay scales from the top over 2s, so the
              sequence reads as progressing rather than simply appearing. */}
          <div aria-hidden="true" className="absolute bottom-3.5 left-[13px] top-3.5 w-px bg-l-border">
            <m.div
              className="absolute inset-0 origin-top"
              style={{ background: "linear-gradient(to bottom, var(--l-accent), rgba(108,142,255,0.25))" }}
              initial={reduceMotion ? { scaleY: 1 } : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 2, delay: 0.5, ease: "easeOut" }}
            />
          </div>

          {STEPS.map((step, idx) => {
            const isLast = idx === lastIndex;
            return (
              <m.li
                key={step.id}
                className={`flex gap-6 ${isLast ? "" : "mb-8"}`}
                variants={{
                  hidden: reduceMotion ? {} : { opacity: 0, x: -12 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
                }}
              >
                <div
                  className={[
                    "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
                    isLast
                      ? "border-l-accent bg-l-accent"
                      : "border-l-border bg-l-surface text-xs text-l-text-3",
                  ].join(" ")}
                >
                  {isLast ? (
                    // The spec strokes this check in #fff, which is 2.60:1 on
                    // the accent fill and fails even the 3:1 non-text minimum.
                    // --l-accent-on is 6.51:1.
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 6l3 3 5-5" stroke="var(--l-accent-on)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span aria-hidden="true">{idx + 1}</span>
                  )}
                </div>

                <div className="pt-1">
                  <div
                    className={`mb-1 text-sm font-semibold ${isLast ? "text-l-accent" : "text-l-text"}`}
                  >
                    {step.label}
                  </div>
                  <div className="text-[13px] leading-[1.6] text-l-text-2">{step.desc}</div>
                  {isLast && (
                    <div className="mt-3">
                      <Fingerprint
                        sectors={SECTORS_A}
                        size={80}
                        numRings={6}
                        label="Generated portfolio fingerprint"
                      />
                    </div>
                  )}
                </div>
              </m.li>
            );
          })}
        </m.ol>
      </div>
    </Band>
  );
}
