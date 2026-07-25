import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/hooks/usePortfolioHistory", () => ({
  usePortfolioHistory: () => ({ data: [] }),
}));

import { PortfolioProfileView } from "@/components/portfolio/PortfolioProfileView";
import { PortfolioHealth, PortfolioProfile } from "@/lib/types/portfolio";

function makeProfile(health: PortfolioHealth): PortfolioProfile {
  return {
    portfolio: {
      id: "p1",
      portfolioType: "verified",
      isPublic: true,
      displayName: "Test Investor",
      strategyTags: [],
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
        })}
        isOwner={false}
      />
    );
    expect(screen.getByText("Volatility")).toBeInTheDocument();
    expect(screen.getByText("18.2%")).toBeInTheDocument();
  });
});
