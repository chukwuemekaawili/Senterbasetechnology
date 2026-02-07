import { useParams, Link, Navigate } from "react-router-dom";
import { Phone, FileText, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PageLayout from "@/components/layout/PageLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { useServiceBySlug, useRelatedServices } from "@/hooks/useServices";

// Import authentic company images as fallbacks
import securityCctv from "@/assets/images/pdf-cctv-camera.jpg";
import solarCarport from "@/assets/images/solar-carport-real.jpg";
import solarStreetLight from "@/assets/images/pdf-solar-street-lights.jpg";
import inverterCombiner from "@/assets/images/inverter-combiner-box.jpg";
import gateMotor from "@/assets/images/gate-motor-installation.jpg";
import technicianElectrical from "@/assets/images/technician-male-electrical.jpg";
import electricFenceWarning from "@/assets/images/electric-fence-warning.jpg";
import solarCarportRender from "@/assets/images/solar-carport-render.jpg";
import satelliteSmartTv from "@/assets/images/satellite-smart-tv.jpg";
import livingRoomInterior from "@/assets/images/living-room-interior.jpg";
import officePartition from "@/assets/images/office-glass-partition.jpg";
import kitchenInterior from "@/assets/images/kitchen-interior.jpg";
import doorFrameInstall from "@/assets/images/door-frame-installation.jpg";
import decorativeGate from "@/assets/images/decorative-iron-gate.jpg";
import distributionPanel from "@/assets/images/distribution-panel.jpg";

const serviceImages: Record<string, string> = {
  "smart-security": securityCctv,
  "solar-energy-installation": solarCarport,
  "solar-street-lights": solarStreetLight,
  "inverter-installation-repairs": inverterCombiner,
  "electronic-gate-installation": gateMotor,
  "general-electrical": technicianElectrical,
  "electric-fencing": electricFenceWarning,
  "carport-installation": solarCarportRender,
  "satellite-installation": satelliteSmartTv,
  "house-decoration-maintenance": livingRoomInterior,
  "interior-decoration-partitioning": officePartition,
  "partitioning-repairs": kitchenInterior,
  "lights-repairs": distributionPanel,
  "door-installation-repairs": doorFrameInstall,
  "gate-installation": decorativeGate,
};

const processSteps = [
  { step: 1, title: "Consult", description: "Discuss your needs and requirements with our experts" },
  { step: 2, title: "Survey", description: "On-site assessment to understand the scope of work" },
  { step: 3, title: "Install", description: "Professional installation by certified technicians" },
  { step: 4, title: "Test", description: "Thorough testing to ensure everything works perfectly" },
  { step: 5, title: "Support", description: "Ongoing maintenance and support when you need it" },
];

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: service, isLoading, error } = useServiceBySlug(slug);
  const { data: relatedServices = [] } = useRelatedServices(service?.relatedSlugs || []);

  // Loading state
  if (isLoading) {
    return (
      <PageLayout title="Loading..." description="">
        <section className="py-20 md:py-28 bg-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <Skeleton className="h-8 w-24 mb-4 bg-primary-foreground/20" />
              <Skeleton className="h-12 w-3/4 mb-4 bg-primary-foreground/20" />
              <Skeleton className="h-6 w-full mb-8 bg-primary-foreground/20" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-32 bg-primary-foreground/20" />
                <Skeleton className="h-12 w-32 bg-primary-foreground/20" />
              </div>
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  // Not found
  if (!service || error) {
    return <Navigate to="/services" replace />;
  }

  const heroImage = (service as any).imageUrl || serviceImages[service.slug] || securityCctv;

  return (
    <PageLayout
      title={service.title}
      description={service.heroDescription}
    >
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
        </div>

        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-heading font-medium">
                {service.category}
              </span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              {service.title}
            </h1>
            <p className="font-body text-lg md:text-xl text-primary-foreground/90 mb-8">
              {service.heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-heading font-semibold shadow-xl"
              >
                <a href="tel:+2348064398669" className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Call Now
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 font-heading font-semibold"
              >
                <Link to={`/contact?service=${service.slug}`} className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Request Quote
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
                What We Do
              </h2>
              <ul className="space-y-4">
                {service.whatWeDo.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="font-body text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src={heroImage} 
                alt={service.title}
                className="w-full h-64 md:h-80 object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
              Benefits
            </h2>
            <p className="font-body text-muted-foreground">
              Why choose our {service.title.toLowerCase()} services
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-card rounded-lg p-6 border border-border/50"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="font-heading font-bold text-primary">{index + 1}</span>
                </div>
                <p className="font-body text-foreground">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
              Our Process
            </h2>
            <p className="font-body text-muted-foreground">
              How we deliver excellence from start to finish
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {processSteps.map((step, index) => (
              <div key={step.step} className="text-center relative">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-heading text-xl font-bold text-primary-foreground">{step.step}</span>
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="font-body text-sm text-muted-foreground">{step.description}</p>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      {service.faqs.length > 0 && (
        <section className="py-16 md:py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Frequently Asked Questions
                </h2>
              </div>
              <Accordion type="single" collapsible className="space-y-4">
                {service.faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`faq-${index}`}
                    className="bg-card rounded-lg border border-border/50 px-6"
                  >
                    <AccordionTrigger className="font-heading font-semibold text-foreground hover:no-underline py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="font-body text-muted-foreground pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      )}

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
                Related Services
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedServices.map((related) => (
                <Link
                  key={related.slug}
                  to={`/services/${related.slug}`}
                  className="group bg-card rounded-xl p-6 border border-border/50 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                    <related.icon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">{related.title}</h3>
                  <p className="font-body text-sm text-muted-foreground mb-3">{related.shortDescription}</p>
                  <div className="flex items-center gap-2 text-primary font-heading font-medium text-sm">
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 md:py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="font-body text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Contact us today for a free consultation and quote for your {service.title.toLowerCase()} project.
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

export default ServiceDetail;
