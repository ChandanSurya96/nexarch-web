/**
 * The Discovery Feed (DiscoveryInvestorSchema) and the Public Investor
 * Library (PublicInvestorSchema) are two different wire shapes — this is
 * the normalized shape InvestorCard actually renders, so one component
 * serves both without knowing which source it came from.
 */
export interface InvestorCardData {
  portfolioId: string | null;
  displayName: string;
  portfolioType: string;
  strategyTags: string[];
  diversificationScore: number | null;
  bio: string | null;
  lastDisclosureUpdate: string | null;
}
