import { InvestorCardData } from "./investorCard";
import { PortfolioHealthResponse, PortfolioResponse } from "./portfolio";

export interface DiscoveryInvestorResponse extends PortfolioResponse {
  health: PortfolioHealthResponse | null;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export function toInvestorCardFromDiscovery(d: DiscoveryInvestorResponse): InvestorCardData {
  return {
    portfolioId: d.id,
    displayName: d.display_name,
    portfolioType: d.portfolio_type,
    strategyTags: d.strategy_tags,
    diversificationScore: d.health ? d.health.diversification_score : null,
    bio: null,
    lastDisclosureUpdate: null,
  };
}

export interface StrategyCategoryResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface StrategyCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export function toStrategyCategory(c: StrategyCategoryResponse): StrategyCategory {
  return { id: c.id, name: c.name, slug: c.slug, description: c.description };
}

export interface PublicInvestorResponse {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  source_disclosure_url: string | null;
  last_disclosure_update: string | null;
  portfolio_id: string | null;
}

export function toInvestorCardFromPublicInvestor(p: PublicInvestorResponse): InvestorCardData {
  return {
    portfolioId: p.portfolio_id,
    displayName: p.name,
    portfolioType: "public",
    strategyTags: [],
    diversificationScore: null,
    bio: p.bio,
    lastDisclosureUpdate: p.last_disclosure_update,
  };
}
