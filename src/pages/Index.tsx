import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";
import FeaturedHighlights from "@/components/FeaturedHighlights";
import ProjectShowcaseBanner from "@/components/ProjectShowcaseBanner";
import StatsCounter from "@/components/StatsCounter";
import TrustAndCredibility from "@/components/TrustAndCredibility";
import Testimonials from "@/components/Testimonials";
import HowWeWork from "@/components/HowWeWork";
import CoveragePreview from "@/components/CoveragePreview";
import GalleryPreview from "@/components/GalleryPreview";
import ChatbotPromo from "@/components/ChatbotPromo";
import SafetyDisclaimer from "@/components/SafetyDisclaimer";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <Hero />
        <ServicesGrid />
        <FeaturedHighlights />
        <ProjectShowcaseBanner />
        <StatsCounter />
        <TrustAndCredibility />
        <Testimonials />
        <HowWeWork />
        <CoveragePreview />
        <GalleryPreview />
        <ChatbotPromo />
        <SafetyDisclaimer />
        <CTABanner />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
