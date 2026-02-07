import { MapPin, Phone, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";
import PageHero from "@/components/shared/PageHero";
import { AdminEditButton } from "@/components/admin/AdminEditButton";
import { usePageSections } from "@/hooks/usePageSections";

const CoverageAreas = () => {
  const { data: sections } = usePageSections("coverage");
  
  const introSection = sections?.find(s => s.section_key === "intro");
  const areasSection = sections?.find(s => s.section_key === "areas");
  const confirmSection = sections?.find(s => s.section_key === "confirm");

  // Parse areas from JSON or use fallback
  const areas = areasSection?.body_json || ["Abuja (FCT)", "Surrounding FCT areas"];

  return (
    <PageLayout
      title="Coverage Areas"
      description="STIL provides technology and electrical services across Abuja (FCT) and surrounding FCT areas. Call to confirm availability for your location."
    >
      <PageHero
        title="Coverage Areas"
        subtitle="We provide comprehensive technology and electrical services throughout Abuja and surrounding areas."
      />

      {/* Main Content */}
      <section className="py-16 md:py-20 relative">
        <div className="absolute top-4 right-4 z-10">
          <AdminEditButton href="/admin/pages" label="Edit Content" />
        </div>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Coverage Statement */}
            <div className="bg-card rounded-2xl p-8 md:p-12 border border-border/50 shadow-lg mb-12">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {introSection?.title || "Service Coverage"}
                  </h2>
                  <p className="font-body text-muted-foreground">
                    {introSection?.subtitle || "Our team is ready to serve you"}
                  </p>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-xl p-6 mb-8">
                <h3 className="font-heading text-xl font-bold text-foreground mb-4">
                  {areasSection?.title || "Areas We Serve"}
                </h3>
                <ul className="space-y-3">
                  {(Array.isArray(areas) ? areas : []).map((area: string, index: number) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-accent" />
                      <span className="font-body text-lg text-foreground">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-secondary/10 rounded-xl p-6 border border-secondary/20">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-heading font-semibold text-foreground mb-1">
                      {confirmSection?.title || "Confirm Availability"}
                    </h4>
                    <p className="font-body text-muted-foreground">
                      {confirmSection?.body_text || "Call to confirm availability for your specific location. Our team will verify coverage and schedule a convenient time for consultation or service."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Available */}
            <div className="mb-12">
              <h3 className="font-heading text-xl font-bold text-foreground mb-6 text-center">
                Services Available in All Coverage Areas
              </h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "Smart Security (CCTV)",
                  "Solar Energy Installation",
                  "Solar Street Lights",
                  "Inverter Installation & Repairs",
                  "Electronic Gate Installation",
                  "General Electrical",
                  "Electric Fencing",
                  "Carport Installation",
                  "Satellite Installation",
                  "House Decoration",
                  "Interior Partitioning",
                  "Door Installation",
                ].map((service) => (
                  <div 
                    key={service}
                    className="bg-card rounded-lg p-4 border border-border/50 text-center"
                  >
                    <span className="font-body text-sm text-foreground">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <p className="font-body text-lg text-muted-foreground mb-6">
                Ready to get started? Contact us to confirm service availability in your area.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-heading font-semibold text-lg px-8 shadow-xl"
              >
                <a href="tel:+2348064398669" className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Call 0806 439 8669
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default CoverageAreas;
