import { PUBLIC_DISCLOSURES } from "@/components/landing/data";
import { Band, Label, Reveal } from "@/components/landing/Primitives";

/**
 * "Public Investor Library" — a timestamped archive of mandatory disclosures.
 *
 * The rows are sample data, not real filings. See data.ts for why: the spec
 * populated this table with named public figures against invented regulatory
 * reference numbers. Structure, columns and hover are unchanged.
 */
export function LibrarySection() {
  return (
    <Band>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:items-start lg:gap-[100px]">
        <Reveal>
          <Label>Public Investor Library</Label>
          <h2 className="mb-5 text-[clamp(2rem,3vw,2.8rem)] font-light leading-[1.2] tracking-[-0.02em] text-l-text">
            Trust through
            <br />
            <span className="font-bold">provenance.</span>
          </h2>
          <p className="text-base leading-[1.8] text-l-text-2">
            Public mandatory disclosures from SEBI regulations, exchange filings, and institutional
            requirements — presented as a searchable, timestamped archive. Not curated. Not
            summarized. Primary sources.
          </p>
        </Reveal>

        <Reveal loose>
          {/* A real table: three aligned columns of tabular data is exactly
              what <table> is for, and it gives the header row a programmatic
              relationship to each cell that a grid of divs cannot. */}
          <table className="w-full">
            <caption className="sr-only">
              Sample public disclosure records, by date, disclosure and reference
            </caption>
            <thead>
              <tr className="border-b border-l-border">
                <th scope="col" className="w-[72px] px-4 pb-3.5 text-left font-mono text-[10px] tracking-[0.12em] text-l-text-3">
                  DATE
                </th>
                <th scope="col" className="px-4 pb-3.5 text-left font-mono text-[10px] tracking-[0.12em] text-l-text-3">
                  DISCLOSURE
                </th>
                <th scope="col" className="w-[140px] px-4 pb-3.5 text-left font-mono text-[10px] tracking-[0.12em] text-l-text-3">
                  REFERENCE
                </th>
              </tr>
            </thead>
            <tbody>
              {PUBLIC_DISCLOSURES.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-l-border-dim transition-colors duration-200 hover:bg-l-surface-2"
                >
                  <td className="px-4 py-5 align-top font-mono text-[11px] text-l-text-3">
                    {row.date}
                  </td>
                  <td className="px-4 py-5 align-top">
                    <div className="mb-1 text-sm font-medium text-l-text">{row.name}</div>
                    <div className="text-xs text-l-text-2">{row.role}</div>
                    <div className="mt-1 font-mono text-[10px] text-l-text-3">{row.type}</div>
                  </td>
                  <td className="break-all px-4 py-5 align-top font-mono text-[10px] text-l-text-3">
                    {row.id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-wrap items-center gap-2 p-4">
            <a
              href="#early-access"
              className="flex items-center gap-1.5 rounded text-[13px] text-l-accent transition-opacity duration-200 hover:opacity-80"
            >
              Browse full archive
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            {/* The spec read "2,400+ filings indexed". Nothing is indexed yet,
                so the rows above are marked as what they are instead. */}
            <span className="text-xs text-l-text-3">· Sample records, illustrative layout</span>
          </div>
        </Reveal>
      </div>
    </Band>
  );
}
