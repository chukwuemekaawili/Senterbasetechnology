import { Phone, ExternalLink, FileText, MessageCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminEditButton } from "@/components/admin/AdminEditButton";
import { usePageSection, CTAButton } from "@/hooks/usePageSections";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useChatbot } from "@/components/chatbot";

const WHATSAPP_MESSAGE = encodeURIComponent("Hello STIL! I'm interested in your services. Please contact me.");

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

const CTABanner = () => {
  const { data: section } = usePageSection("home", "cta_banner");
  const { data: settings } = useSiteSettings();
  const { openChat } = useChatbot();
  
  const whatsappNumber = settings?.whatsapp_number || "2348064398669";
  const phone = settings?.phone || "+2348064398669";
  const phoneDisplay = phone.replace("+234", "0").replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");

  const title = section?.title || "Ready to Power Your Property?";
  const subtitle = section?.body_text || "Get in touch today for a free consultation. Our team is ready to deliver innovative, reliable, and sustainable solutions.";
  const ctas = section?.ctas || [];

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

  // Get button variant
  const getButtonVariant = (variant: CTAButton["variant"]) => {
    switch (variant) {
      case "primary":
        return "default";
      case "secondary":
        return "secondary";
      case "outline":
        return "outline";
      case "ghost":
        return "ghost";
      default:
        return "default";
    }
  };

  return (
    <section className="py-16 bg-secondary relative">
      {/* Admin Edit Button */}
      <div className="absolute top-4 right-4 z-10">
        <AdminEditButton href="/admin/content" label="Edit Content" />
      </div>
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">
          {title}
        </h2>
        <p className="font-body text-lg text-secondary-foreground/90 mb-8 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {/* Always show phone number prominently */}
          <a
            href={`tel:${phone}`}
            className="font-heading text-3xl md:text-4xl font-bold text-secondary-foreground hover:underline flex items-center gap-3"
          >
            <Phone className="w-8 h-8" />
            {phoneDisplay}
          </a>
          
          {/* Render CMS CTAs or default Call Now button */}
          {ctas.length > 0 ? (
            ctas.map((cta) => {
              const icon = getCTAIcon(cta);
              const href = resolveHref(cta.href);
              const isExternal = href.startsWith("http") || href.startsWith("tel:");

              if (cta.href === "chat") {
                return (
                  <Button
                    key={cta.label}
                    onClick={(e) => handleCTAClick(cta, e)}
                    size="lg"
                    variant={getButtonVariant(cta.variant)}
                    className="font-heading font-semibold text-lg px-8 shadow-xl"
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
                  variant={getButtonVariant(cta.variant)}
                  className="font-heading font-semibold text-lg px-8 shadow-xl"
                >
                  <a 
                    href={href}
                    target={isExternal && !href.startsWith("tel:") ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-2"
                  >
                    {icon}
                    {cta.label}
                  </a>
                </Button>
              );
            })
          ) : (
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-semibold text-lg px-8 shadow-xl"
            >
              <a href={`tel:${phone}`} className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Call Now
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
