import { Container } from "@/components/landing/Primitives";

/** The footer's smaller mark — three rings rather than the nav's five. */
function FooterGlyph() {
  const rings = [0, 1, 2].map((i) => {
    const base = 2.5 + i * 1.8;
    const points: string[] = [];
    for (let j = 0; j < 36; j++) {
      const angle = (j / 36) * Math.PI * 2 - Math.PI / 2;
      const radius = base + Math.sin(i * 1.9 + j * 0.4) * 0.4;
      points.push(
        `${j === 0 ? "M" : "L"}${(8 + radius * Math.cos(angle)).toFixed(1)},${(8 + radius * Math.sin(angle)).toFixed(1)}`,
      );
    }
    return { d: `${points.join(" ")}Z`, opacity: 0.3 + i * 0.2 };
  });

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      {rings.map((ring, i) => (
        <path key={i} d={ring.d} fill="none" stroke="var(--l-accent)" strokeWidth="0.6" opacity={ring.opacity} />
      ))}
      <circle cx="8" cy="8" r="1.2" fill="var(--l-accent)" opacity="0.9" />
    </svg>
  );
}

const LINKS = ["Privacy", "Terms", "Security"];

export function LandingFooter() {
  return (
    <footer className="border-t border-l-border py-12">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <FooterGlyph />
            <span className="font-mono text-[13px] tracking-[0.04em] text-l-text-2">Nexarch</span>
            <span className="ml-2 text-[13px] text-l-text-3">
              · Portfolio Identity &amp; Investor Discovery
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            {LINKS.map((link) => (
              <a
                key={link}
                // The spec wires these to "#". Pointed at the waitlist until
                // the pages exist — a link that goes nowhere is worse than one
                // that goes somewhere honest.
                href="#early-access"
                className="rounded text-xs text-l-text-3 transition-colors duration-200 hover:text-l-text-2"
              >
                {link}
              </a>
            ))}
            <span className="font-mono text-[11px] tracking-[0.06em] text-l-text-3">
              Made in India · 2024
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
