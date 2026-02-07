import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { AdminEditButton } from "@/components/admin/AdminEditButton";

// Import authentic company photos directly
import solarCarportReal from "@/assets/images/solar-carport-real.jpg";
import solarCarportRender from "@/assets/images/solar-carport-render.jpg";
import decorativeGate from "@/assets/images/decorative-iron-gate.jpg";
import gateMotor from "@/assets/images/gate-motor-installation.jpg";
import officePartition from "@/assets/images/office-glass-partition.jpg";
import securityCctv from "@/assets/images/pdf-cctv-camera.jpg";
import electricFence from "@/assets/images/electric-fence-warning.jpg";
import inverterCombiner from "@/assets/images/inverter-combiner-box.jpg";
import distributionPanel from "@/assets/images/distribution-panel.jpg";
import satelliteDish from "@/assets/images/satellite-smart-tv.jpg";

// Static gallery items - authentic company photos
const staticGalleryItems = [
  { id: "1", title: "Solar Carport Installation", alt: "Real solar carport with metal frame structure by STIL", category: "Solar", imageUrl: solarCarportReal },
  { id: "2", title: "Solar Carport Design", alt: "3D render of solar carport with photovoltaic panels", category: "Carports", imageUrl: solarCarportRender },
  { id: "3", title: "Decorative Iron Gate", alt: "Decorative black iron driveway gate installation", category: "Gates/Fencing", imageUrl: decorativeGate },
  { id: "4", title: "Gate Motor Installation", alt: "Automatic sliding gate motor unit by STIL technicians", category: "Gates/Fencing", imageUrl: gateMotor },
  { id: "5", title: "Office Glass Partitioning", alt: "Modern office glass partition installation", category: "Interiors", imageUrl: officePartition },
  { id: "6", title: "CCTV Security System", alt: "Professional CCTV camera installation", category: "Security", imageUrl: securityCctv },
  { id: "7", title: "Electric Fence Installation", alt: "Electric fence with warning signs for perimeter security", category: "Security", imageUrl: electricFence },
  { id: "8", title: "Inverter System Setup", alt: "Solar inverter and PV combiner box installation", category: "Inverter", imageUrl: inverterCombiner },
  { id: "9", title: "Electrical Distribution Panel", alt: "Electrical distribution panel with switches", category: "Electrical", imageUrl: distributionPanel },
  { id: "10", title: "Satellite TV Installation", alt: "Modern satellite dish with smart TV setup", category: "Satellite", imageUrl: satelliteDish },
];

const GalleryPreview = () => {
  const { ref, isRevealed } = useScrollReveal<HTMLDivElement>();
  const galleryItems = staticGalleryItems;
  const showItems = isRevealed || true; // Show immediately

  return (
    <section id="gallery" className="py-20 bg-background relative">
      {/* Admin Edit Button */}
      <div className="absolute top-4 right-4 z-10">
        <AdminEditButton href="/admin/gallery" label="Edit Gallery" />
      </div>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Projects
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of our completed installations across Abuja and surrounding areas
          </p>
        </div>

        {/* Gallery Grid */}
        <div ref={ref}>
          <div 
            className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 transition-all duration-700 ${
              showItems ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {galleryItems.map((image, index) => (
              <div
                key={image.id}
                className={`group relative overflow-hidden rounded-lg ${
                  index === 0 || index === 4 ? "md:col-span-2 md:row-span-2" : ""
                }`}
                style={{ 
                  transitionDelay: showItems ? `${index * 60}ms` : "0ms",
                }}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={image.imageUrl}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <span className="font-body text-xs text-secondary font-medium uppercase tracking-wider">
                      {image.category}
                    </span>
                    <p className="font-heading text-sm font-semibold text-primary-foreground">
                      {image.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="font-heading font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all hover:-translate-y-0.5"
          >
            <a href="/projects-gallery" className="flex items-center gap-2">
              View Full Gallery
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;
