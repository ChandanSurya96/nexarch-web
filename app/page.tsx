import { BrokerFlowSection } from "@/components/landing/BrokerFlowSection";
import { ComparisonSection } from "@/components/landing/ComparisonSection";
import { DiscoverySection } from "@/components/landing/DiscoverySection";
import { EarlyAccessSection } from "@/components/landing/EarlyAccessSection";
import { Hero } from "@/components/landing/Hero";
import { IdentitySection } from "@/components/landing/IdentitySection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { LibrarySection } from "@/components/landing/LibrarySection";
import { MotionProvider } from "@/components/landing/MotionProvider";
import { PhilosophySection } from "@/components/landing/PhilosophySection";
import { ProblemSection } from "@/components/landing/ProblemSection";

/**
 * The marketing landing page, recreated from the Figma spec.
 *
 * `.landing` scopes the Figma palette and body face to this route — see
 * styles/landing.css for why they aren't applied globally, and for the one
 * token that deviates from the spec on measured accessibility grounds.
 */
export default function HomePage() {
  return (
    <div className="landing min-h-screen">
      <MotionProvider>
        <LandingNav />
        <main id="main">
          <Hero />
          <ProblemSection />
          <BrokerFlowSection />
          <IdentitySection />
          <DiscoverySection />
          <ComparisonSection />
          <LibrarySection />
          <PhilosophySection />
          <EarlyAccessSection />
        </main>
        <LandingFooter />
      </MotionProvider>
    </div>
  );
}
