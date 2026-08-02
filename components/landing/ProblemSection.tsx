import { Band, Label, Reveal } from "@/components/landing/Primitives";
import { ScreenshotChain } from "@/components/landing/ScreenshotChain";

/**
 * "The Problem" — why a screenshot isn't evidence.
 *
 * Two columns at `lg`, stacking below it. The right column carries the
 * three-step degradation chain and the verified card that answers it.
 */
export function ProblemSection() {
  return (
    <Band id="how">
      <Reveal loose>
        <Label>The Problem</Label>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="mb-6 text-[clamp(2rem,3.5vw,3rem)] font-light leading-[1.2] tracking-[-0.02em] text-l-text">
              Screenshots don&apos;t prove
              <br />
              <em className="font-light italic">anything.</em>
            </h2>
            <p className="mb-8 text-base leading-[1.8] text-l-text-2">
              A screenshot can hide losses, ignore timeline, omit starting capital, and erase every
              position that didn&apos;t perform. It&apos;s a claim dressed as evidence.
            </p>
            <p className="text-base leading-[1.8] text-l-text-2">
              Nexarch replaces claims with identity — a mathematically generated, broker-verified
              portrait of what you actually own.
            </p>
          </div>

          <ScreenshotChain />
        </div>
      </Reveal>
    </Band>
  );
}
