import { Phone, Target, Heart, Users, Building2, Home, Shield, Zap, CheckCircle, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";
import PageHero from "@/components/shared/PageHero";
import TeamMembers from "@/components/TeamMembers";
import { AdminEditButton } from "@/components/admin/AdminEditButton";
import { usePageSections } from "@/hooks/usePageSections";
import technicianImage from "@/assets/images/technician-orange-helmet.jpg";

// Icon mapping for dynamic rendering
const iconMap: Record<string, LucideIcon> = {
  Shield, Target, Zap, Heart, Home, Building2, Users,
};

// Fallback data
const fallbackValues = [
  { icon: "Shield", title: "Safety First", description: "We prioritize safety in every installation and service we deliver." },
  { icon: "Target", title: "Reliability", description: "Dependable solutions that work when you need them most." },
  { icon: "Zap", title: "Innovation", description: "Embracing cutting-edge technology for sustainable living." },
  { icon: "Heart", title: "Customer Focus", description: "Your satisfaction drives everything we do." },
];

const fallbackClients = [
  { icon: "Home", title: "Residential Clients", description: "Homeowners seeking security, solar, and electrical solutions for their properties." },
  { icon: "Building2", title: "Commercial Businesses", description: "Offices, retail spaces, and commercial establishments requiring professional installations." },
  { icon: "Users", title: "Government Clients", description: "Government agencies and public institutions with large-scale infrastructure needs." },
];

const About = () => {
  const { data: sections, isLoading } = usePageSections("about");

  // Helper to get section by key
  const getSection = (key: string) => sections?.find(s => s.section_key === key);

  const introSection = getSection("intro");
  const missionSection = getSection("mission");
  const valuesSection = getSection("values");
  const clientsSection = getSection("clients");
  const ctaSection = getSection("cta");

  // Parse JSON data with fallbacks
  const values = valuesSection?.body_json || fallbackValues;
  const clients = clientsSection?.body_json || fallbackClients;

  return (
    <PageLayout
      title="About Us"
      description="Learn about Senterbase Technology & Investment Ltd (STIL) - delivering innovative, reliable, and sustainable technology and electrical solutions in Abuja."
    >
      <PageHero
        title="About STIL"
        subtitle="Delivering innovative, reliable, and sustainable technology and electrical solutions for secure, modern living."
      />

      {/* Company Intro */}
      <section className="py-16 md:py-20 relative">
        <div className="absolute top-4 right-4 z-10">
          <AdminEditButton href="/admin/pages" label="Edit Content" />
        </div>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
                {introSection?.title || "Who We Are"}
              </h2>
              <div className="space-y-4 font-body text-muted-foreground">
                {(introSection?.body_text || `Senterbase Technology & Investment Ltd (STIL) is a leading technical services provider based in Abuja, Nigeria. We specialize in comprehensive solutions spanning smart security systems, solar energy, electrical installations, automated gates, electric fencing, carports, and interior decoration.

With years of experience serving Abuja (FCT) and surrounding FCT areas, we have built a reputation for quality workmanship, reliable service, and sustainable solutions that meet the evolving needs of our diverse clientele.

Our team of skilled technicians and engineers is committed to delivering excellence in every project, from initial consultation through installation and ongoing maintenance support.`).split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
              {/* Professional Team Image */}
              <div className="mt-8 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={introSection?.image_url || technicianImage} 
                  alt="STIL technician in safety gear with power drill" 
                  className="w-full h-64 object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="bg-muted/50 rounded-xl p-8 border border-border/50">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">Professional Expertise</h3>
                    <p className="font-body text-sm text-muted-foreground">Certified technicians with proven track records</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">Quality Materials</h3>
                    <p className="font-body text-sm text-muted-foreground">Premium products from trusted manufacturers</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">Maintenance Support</h3>
                    <p className="font-body text-sm text-muted-foreground">Ongoing service and support after installation</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">Fast Response</h3>
                    <p className="font-body text-sm text-muted-foreground">Quick turnaround on quotes and service calls</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
              {missionSection?.title || "Our Mission"}
            </h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              {missionSection?.body_text || "To deliver innovative, reliable, and sustainable technology and electrical solutions that empower individuals, businesses, and government institutions to achieve secure, modern living. We are committed to excellence, safety, and customer satisfaction in every project we undertake."}
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 relative">
        <div className="absolute top-4 right-4 z-10">
          <AdminEditButton href="/admin/pages" label="Edit Values" />
        </div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
              {valuesSection?.title || "Our Values"}
            </h2>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto">
              {valuesSection?.subtitle || "The principles that guide everything we do"}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value: any) => {
              const IconComponent = iconMap[value.icon] || Shield;
              return (
                <div 
                  key={value.title}
                  className="bg-card rounded-xl p-6 border border-border/50 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="font-body text-sm text-muted-foreground">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Members */}
      <TeamMembers />

      {/* Client Types */}
      <section className="py-16 md:py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
              {clientsSection?.title || "Who We Serve"}
            </h2>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto">
              {clientsSection?.subtitle || "Trusted by individuals, businesses, and government clients across Abuja"}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {clients.map((client: any) => {
              const IconComponent = iconMap[client.icon] || Users;
              return (
                <div 
                  key={client.title}
                  className="bg-card rounded-xl p-8 border border-border/50 hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                    <IconComponent className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-3">{client.title}</h3>
                  <p className="font-body text-muted-foreground">{client.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            {ctaSection?.title || "Ready to Work With Us?"}
          </h2>
          <p className="font-body text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            {ctaSection?.body_text || "Contact us today to discuss your project requirements. Our team is ready to deliver solutions that exceed your expectations."}
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
      </section>
    </PageLayout>
  );
};

export default About;
