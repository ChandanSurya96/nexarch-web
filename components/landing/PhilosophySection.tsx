import { Container, Label, Reveal } from "@/components/landing/Primitives";

const IS_ITEMS = [
  "A cryptographically verified snapshot of your actual holdings",
  "A direct connection to your broker — the only source of truth",
  "A point-in-time record sealed with a timestamp",
  "Independently reproducible — the math is auditable",
  "A statement of what you owned at a specific moment",
];

const IS_NOT_ITEMS = [
  "An endorsement of your investment strategy",
  "A guarantee of future performance",
  "A score, rating, or ranking of any kind",
  "A substitute for your own research and judgment",
  "A claim about who you are as an investor",
];

/** One side of the IS / IS NOT pair. */
function Column({
  qualifier,
  items,
  affirmative,
}: {
  qualifier: string;
  items: string[];
  affirmative: boolean;
}) {
  return (
    <div
      className={[
        "rounded-xl border border-l-border p-8 sm:p-12",
        affirmative
          ? "bg-l-surface-2 lg:rounded-r-none"
          : "bg-l-bg lg:rounded-l-none",
      ].join(" ")}
    >
      <h3 className="mb-9 flex flex-wrap items-center gap-2 text-[28px] font-bold text-l-text">
        Verification
        <span className={affirmative ? "text-l-accent" : "text-l-text-3"}>{qualifier}</span>
      </h3>
      <ul className="flex flex-col gap-5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3.5">
            {affirmative ? (
              <span
                aria-hidden="true"
                className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-l-accent-20"
                style={{ background: "rgba(108,142,255,0.09)" }}
              >
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1.5 4.5l2 2 4-4" stroke="var(--l-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-l-border"
              >
                <span className="h-px w-1.5 rounded-sm bg-l-text-3" />
              </span>
            )}
            <span
              className={`text-[15px] leading-[1.6] ${affirmative ? "text-l-text-2" : "text-l-text-3"}`}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * "Verification Philosophy" — what a verified badge does and does not claim.
 *
 * The band takes --l-surface rather than the page background, so the pair sits
 * on a lighter field. Kept on its own section element rather than `Band`
 * because that background is section-wide, not column-wide.
 */
export function PhilosophySection() {
  return (
    <section
      id="philosophy"
      className="border-t border-l-border bg-l-surface py-20 sm:py-28 lg:py-32"
    >
      <Container>
        <Reveal>
          <Label>Verification Philosophy</Label>
          <h2 className="mx-auto mb-14 max-w-[600px] text-center text-[clamp(2rem,3.5vw,3rem)] font-light leading-[1.2] tracking-[-0.02em] text-l-text lg:mb-[72px]">
            Precise about what
            <br />
            verification means.
          </h2>
        </Reveal>

        <div className="grid gap-0.5 lg:grid-cols-2">
          <Reveal>
            <Column qualifier="IS" items={IS_ITEMS} affirmative />
          </Reveal>
          <Reveal>
            <Column qualifier="IS NOT" items={IS_NOT_ITEMS} affirmative={false} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
