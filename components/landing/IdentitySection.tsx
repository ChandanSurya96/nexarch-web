import { IdentityCard } from "@/components/landing/IdentityCard";
import { Band, Label, Reveal } from "@/components/landing/Primitives";

/**
 * "Portfolio Identity" — a centred introduction over the full identity card.
 *
 * `overflow-hidden` on the band matches the spec: the card's shadow and the
 * fingerprint's overflowing strokes must not widen the page.
 */
export function IdentitySection() {
  return (
    <Band className="overflow-hidden">
      <Reveal>
        <Label>Portfolio Identity</Label>
        <div className="mb-16 text-center lg:mb-20">
          <h2 className="mb-4 text-[clamp(2rem,3.5vw,3rem)] font-light leading-[1.2] tracking-[-0.02em] text-l-text">
            Every portfolio has a fingerprint.
            <br />
            <span className="font-bold">Yours is unique.</span>
          </h2>
          <p className="mx-auto max-w-[480px] text-base text-l-text-2">
            A verified identity card that assembles from your real holdings. Not a summary. Not a
            snapshot. A cryptographically anchored record.
          </p>
        </div>
      </Reveal>

      <IdentityCard />
    </Band>
  );
}
