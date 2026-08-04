import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/hooks/usePortfolioHistory", () => ({
  usePortfolioHistory: () => ({ data: [] }),
}));

// Stubbed rather than wrapped in a QueryClientProvider, matching how this file
// already isolates the component's other query. Returning an empty list is the
// stricter setup: it forces the strategy-label assertions below down the
// local-categorization and humanize paths rather than letting a fixture name
// satisfy them.
vi.mock("@/lib/hooks/useStrategyCategories", () => ({
  useStrategyCategories: () => ({ data: [] }),
}));

import { PortfolioProfileView } from "@/components/portfolio/PortfolioProfileView";
import {
  PortfolioHealth,
  PortfolioProfile,
  StrategyCategorizationEntry,
} from "@/lib/types/portfolio";

function makeProfile(
  health: PortfolioHealth,
  options: { strategyTags?: string[]; strategyCategorization?: StrategyCategorizationEntry[] } = {}
): PortfolioProfile {
  return {
    portfolio: {
      id: "p1",
      portfolioType: "verified",
      isPublic: true,
      displayName: "Test Investor",
      strategyTags: options.strategyTags ?? [],
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    holdings: [],
    analytics: {
      portfolioId: "p1",
      totalValue: 1000,
      sectorAllocation: {},
      health,
      strategyOverview: null,
      asOf: "2026-07-25",
      strategyCategorization: options.strategyCategorization ?? [],
    },
    activity: [],
  };
}

describe("PortfolioProfileView volatility StatCard", () => {
  it("does not render a Volatility stat when health.volatility is null", () => {
    render(
      <PortfolioProfileView
        profile={makeProfile({
          diversificationScore: 0.7,
          sectorConcentrationHhi: 0.3,
          portfolioAgeDays: 10,
          holdingCount: 2,
          volatility: null,
          momentum: null,
        })}
        isOwner={false}
      />
    );
    expect(screen.queryByText("Volatility")).not.toBeInTheDocument();
  });

  it("renders a Volatility stat as a percentage when present", () => {
    render(
      <PortfolioProfileView
        profile={makeProfile({
          diversificationScore: 0.7,
          sectorConcentrationHhi: 0.3,
          portfolioAgeDays: 10,
          holdingCount: 2,
          volatility: 0.182,
          momentum: null,
        })}
        isOwner={false}
      />
    );
    expect(screen.getByText("Volatility")).toBeInTheDocument();
    expect(screen.getByText("18.2%")).toBeInTheDocument();
  });
});

describe("PortfolioProfileView momentum StatCard", () => {
  it("does not render a Momentum stat when health.momentum is null", () => {
    render(
      <PortfolioProfileView
        profile={makeProfile({
          diversificationScore: 0.7,
          sectorConcentrationHhi: 0.3,
          portfolioAgeDays: 10,
          holdingCount: 2,
          volatility: null,
          momentum: null,
        })}
        isOwner={false}
      />
    );
    expect(screen.queryByText("Momentum")).not.toBeInTheDocument();
  });

  it("renders a signed Momentum percentage when present", () => {
    render(
      <PortfolioProfileView
        profile={makeProfile({
          diversificationScore: 0.7,
          sectorConcentrationHhi: 0.3,
          portfolioAgeDays: 10,
          holdingCount: 2,
          volatility: null,
          momentum: 0.14,
        })}
        isOwner={false}
      />
    );
    expect(screen.getByText("Momentum")).toBeInTheDocument();
    expect(screen.getByText("+14.0%")).toBeInTheDocument();
  });
});

describe("PortfolioProfileView strategy tag explanations", () => {
  it("gives an auto-categorized tag a title matching its explanation", () => {
    render(
      <PortfolioProfileView
        profile={makeProfile(
          {
            diversificationScore: 0.7,
            sectorConcentrationHhi: 0.3,
            portfolioAgeDays: 10,
            holdingCount: 2,
            volatility: 0.1,
            momentum: null,
          },
          {
            strategyTags: ["low-risk"],
            strategyCategorization: [
              {
                slug: "low-risk",
                name: "Low-risk",
                explanation: "Annualized volatility of 10.0% is at or below the 15% threshold.",
              },
            ],
          }
        )}
        isOwner={false}
      />
    );
    // The badge shows the category's display name, not its slug. Asserting on
    // "Low-risk" and explicitly denying "low-risk" is what makes this a
    // regression test: rendering the raw slug fails on the second assertion
    // even if the tooltip is still wired up correctly.
    const badge = screen.getByText("Low-risk");
    expect(badge).toHaveAttribute(
      "title",
      "Annualized volatility of 10.0% is at or below the 15% threshold."
    );
    expect(screen.queryByText("low-risk")).toBeNull();
  });

  it("renders a manually-curated tag with no title when there's no matching explanation", () => {
    render(
      <PortfolioProfileView
        profile={makeProfile(
          {
            diversificationScore: 0.7,
            sectorConcentrationHhi: 0.3,
            portfolioAgeDays: 10,
            holdingCount: 2,
            volatility: null,
            momentum: null,
          },
          { strategyTags: ["value"], strategyCategorization: [] }
        )}
        isOwner={false}
      />
    );
    // Library portfolios carry manually-curated tags and an empty
    // categorization array, so there is no display name to resolve against.
    // The slug is reformatted rather than printed raw — this covers the
    // fallback branch, which is the only path a Public Investor Library
    // portfolio ever takes.
    expect(screen.getByText("Value")).not.toHaveAttribute("title");
    expect(screen.queryByText("value")).toBeNull();
  });
});
