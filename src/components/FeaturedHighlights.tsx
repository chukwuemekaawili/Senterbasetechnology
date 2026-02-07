import { Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminEditButton } from "@/components/admin/AdminEditButton";

// Import authentic company photos directly
import securityImage from "@/assets/images/pdf-cctv-camera.jpg";
import solarImage from "@/assets/images/solar-carport-real.jpg";
import electricalImage from "@/assets/images/technician-female-electrical.jpg";

const FeaturedHighlights = () => {
  const highlights = [
    {
      title: "Smart Security",
      subtitle: "Complete Protection Solutions",
      description: "Experience complete coverage with integrated cameras and sensors, safeguarding every access point thoroughly. CCTV Installation, Alarm Monitoring, and Sensor Integration.",
      image: securityImage,
      accent: "primary",
      alt: "Professional CCTV security camera installation",
    },
    {
      title: "Solar Energy Installation",
      subtitle: "Renewable Energy Solutions",
      description: "Green energy solutions with significant cost savings. Professional and reliable service with seamless installation for optimal performance.",
      image: solarImage,
      accent: "secondary",
      alt: "Solar carport installation with photovoltaic panels by STIL technicians",
    },
    {
      title: "General Electrical",
      subtitle: "Comprehensive Solutions",
      description: "We provide comprehensive electrical solutions for residential and commercial customers. Wiring, rewiring, electrical installation, repair, and lighting design.",
      image: electricalImage,
      accent: "accent",
      alt: "Nigerian female electrician working on distribution panel",
    },
  ];

  return (
    <section className="py-20 bg-background relative">
      {/* Admin Edit Button */}
      <div className="absolute top-4 right-4 z-10">
        <AdminEditButton href="/admin/pages" label="Edit Content" />
      </div>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Solutions
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Our most requested services delivering innovative, reliable, and sustainable results
          </p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {highlights.map((highlight) => (
            <div
              key={highlight.title}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={highlight.image}
                  alt={highlight.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent opacity-90" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-primary-foreground">
                <span className="font-body text-sm font-medium text-secondary mb-1">
                  {highlight.subtitle}
                </span>
                <h3 className="font-heading text-2xl font-bold mb-3">
                  {highlight.title}
                </h3>
                <p className="font-body text-sm text-primary-foreground/80 mb-4 line-clamp-3">
                  {highlight.description}
                </p>
                <div className="flex gap-3">
                  <Button
                    asChild
                    size="sm"
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-heading font-semibold"
                  >
                    <a href="tel:+2348064398669" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Call Now
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="text-primary-foreground hover:text-secondary hover:bg-transparent"
                  >
                    <a href="#services" className="flex items-center gap-1">
                      Learn More
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedHighlights;
