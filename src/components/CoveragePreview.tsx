import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminEditButton } from "@/components/admin/AdminEditButton";

// Direct import of map image
import abujaMapImage from "@/assets/images/stock-abuja-map.jpg";

const CoveragePreview = () => {
  // Use local asset directly
  const mapImage = abujaMapImage;

  return (
    <section className="py-20 bg-muted/50 relative">
      {/* Admin Edit Button */}
      <div className="absolute top-4 right-4 z-10">
        <AdminEditButton href="/admin/pages" label="Edit Coverage" />
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-secondary" />
              <span className="font-body text-sm font-medium text-secondary uppercase tracking-wider">
                Coverage Areas
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              Serving Abuja & Beyond
            </h2>
            <p className="font-body text-lg text-muted-foreground mb-6">
              Senterbase Technology and Investment Ltd is a professional technology company based in Abuja, Nigeria. We proudly serve clients across:
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-secondary rounded-full" />
                <span className="font-body text-foreground font-medium">Abuja (FCT)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-accent rounded-full" />
                <span className="font-body text-foreground font-medium">Surrounding FCT areas</span>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              className="font-heading font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <a href="/coverage-areas" className="flex items-center gap-2">
                See Full Coverage
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>

          {/* Map Image - Admin managed */}
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-2xl shadow-xl border-2 border-border">
              <img
                src={mapImage}
                alt="STIL coverage areas in Abuja, Nigeria"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-lg border border-border">
              <div className="flex items-center gap-3">
                <MapPin className="w-8 h-8 text-secondary" />
                <div>
                  <p className="font-heading font-bold text-foreground">Abuja, Nigeria</p>
                  <p className="font-body text-xs text-muted-foreground">No 7 Port Harcourt Crescent, Area 11</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoveragePreview;
