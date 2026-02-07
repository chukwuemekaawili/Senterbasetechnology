import { useState } from "react";
import { Phone, FileText, MessageCircle, MessageSquare, ChevronDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatbot } from "@/components/chatbot";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useHeroContent, CTAButton } from "@/hooks/useHeroContent";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import ScrollIndicator from "@/components/ScrollIndicator";
import { AdminEditButton } from "@/components/admin/AdminEditButton";
import { motion, AnimatePresence } from "framer-motion";

const WHATSAPP_MESSAGE = encodeURIComponent("Hello STIL! I'm interested in your services. Please contact me.");

// Default CTAs if none configured in CMS
const DEFAULT_CTAS: CTAButton[] = [
  { label: "Call Now", href: "tel:+2348064398669", variant: "primary" },
  { label: "WhatsApp", href: "whatsapp", variant: "secondary" },
  { label: "Request Quote", href: "/contact", variant: "outline" },
  { label: "Start Chat", href: "chat", variant: "ghost" },
];

// Helper to get icon for CTA based on href or label
function getCTAIcon(cta: CTAButton) {
  const label = cta.label.toLowerCase();
  const href = cta.href.toLowerCase();
  
  if (href.startsWith("tel:") || label.includes("call")) return <Phone className="w-5 h-5" />;
  if (href === "whatsapp" || href.includes("wa.me") || label.includes("whatsapp")) return <MessageSquare className="w-5 h-5" />;
  if (href === "chat" || label.includes("chat")) return <MessageCircle className="w-5 h-5" />;
  if (label.includes("quote") || label.includes("contact")) return <FileText className="w-5 h-5" />;
  if (href.startsWith("http")) return <ExternalLink className="w-5 h-5" />;
  return null;
}

// Get button style classes based on variant
function getCTAClasses(variant: CTAButton["variant"], isMobile = false) {
  const base = isMobile 
    ? "w-full font-heading font-semibold py-5" 
    : "font-heading font-semibold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5";
  
  switch (variant) {
    case "primary":
      return `${base} bg-secondary hover:bg-secondary/90 text-secondary-foreground`;
    case "secondary":
      return `${base} bg-green-600 hover:bg-green-700 text-white`;
    case "outline":
      return `${base} border-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10`;
    case "ghost":
      return `${base} border-2 border-secondary/50 bg-secondary/10 text-primary-foreground hover:bg-secondary/20`;
    default:
      return base;
  }
}

const Hero = () => {
  const { openChat } = useChatbot();
  const { data: settings } = useSiteSettings();
  const { data: heroContent } = useHeroContent();
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  
  const whatsappNumber = settings?.whatsapp_number || "2348064398669";

  // Parse title into two lines if comma exists
  const title = heroContent?.title || "Powering Secure, Modern Living";
  const titleParts = title.split(",");
  const title1 = titleParts[0]?.trim() + (titleParts.length > 1 ? "," : "");
  const title2 = titleParts.slice(1).join(",").trim();

  const badge = heroContent?.subtitle || "STIL Nigeria";
  const description = heroContent?.body_text || "From solar energy to smart security—STIL delivers sustainable solutions across Abuja (FCT) and surrounding FCT areas.";

  // Use CTAs from CMS or fallback to defaults
  const ctas = heroContent?.ctas?.length ? heroContent.ctas : DEFAULT_CTAS;
  const primaryCTA = ctas[0];
  const secondaryCTAs = ctas.slice(1);

  // Resolve special href values
  const resolveHref = (href: string) => {
    if (href === "whatsapp") return `https://wa.me/${whatsappNumber}?text=${WHATSAPP_MESSAGE}`;
    if (href === "chat") return "#";
    return href;
  };

  // Handle click for special actions
  const handleCTAClick = (cta: CTAButton, e: React.MouseEvent) => {
    if (cta.href === "chat") {
      e.preventDefault();
      openChat();
    }
  };

  // Render a single CTA button
  const renderCTA = (cta: CTAButton, isMobile = false) => {
    const icon = getCTAIcon(cta);
    const classes = getCTAClasses(cta.variant, isMobile);
    const href = resolveHref(cta.href);
    const isExternal = href.startsWith("http") || href.startsWith("tel:");

    if (cta.href === "chat") {
      return (
        <Button
          key={cta.label}
          onClick={(e) => handleCTAClick(cta, e)}
          size="lg"
          className={classes}
        >
          {icon && <span className="mr-2">{icon}</span>}
          {cta.label}
        </Button>
      );
    }

    return (
      <Button
        key={cta.label}
        asChild
        size="lg"
        className={classes}
      >
        <a 
          href={href}
          target={isExternal && !href.startsWith("tel:") ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          onClick={(e) => handleCTAClick(cta, e as any)}
          className="flex items-center gap-2"
        >
          {icon}
          {cta.label}
        </a>
      </Button>
    );
  };

  // Desktop CTAs
  const desktopPrimaryCTA = primaryCTA ? renderCTA(primaryCTA) : null;
  const desktopSecondaryCTAs = (
    <div className="flex flex-col sm:flex-row gap-4">
      {secondaryCTAs.map((cta) => renderCTA(cta))}
    </div>
  );

  // Mobile CTAs with expandable menu
  const mobileSecondaryCTAs = (
    <div className="flex flex-col gap-3 w-full">
      {primaryCTA && renderCTA(primaryCTA, true)}
      
      {secondaryCTAs.length > 0 && (
        <>
          <Button
            onClick={() => setShowMoreOptions(!showMoreOptions)}
            size="lg"
            variant="outline"
            className="w-full border-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 font-heading font-semibold py-4"
          >
            More Options
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showMoreOptions ? "rotate-180" : ""}`} />
          </Button>

          <AnimatePresence>
            {showMoreOptions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-3 overflow-hidden"
              >
                {secondaryCTAs.map((cta) => renderCTA(cta, true))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );

  return (
    <div className="relative">
      {/* Admin Edit Button */}
      <div className="absolute top-4 right-4 z-20">
        <AdminEditButton href="/admin/hero" label="Edit Hero" />
      </div>
      <HeroGeometric
        badge={badge}
        title1={title1}
        title2={title2}
        description={description}
        showCTAs={true}
        ctaPrimary={
          <>
            <div className="hidden md:block">{desktopPrimaryCTA}</div>
          </>
        }
        ctaSecondary={
          <>
            <div className="hidden md:flex flex-col sm:flex-row gap-4">{desktopSecondaryCTAs}</div>
            <div className="md:hidden w-full">{mobileSecondaryCTAs}</div>
          </>
        }
      />
      <ScrollIndicator targetId="services" />
    </div>
  );
};

export default Hero;
