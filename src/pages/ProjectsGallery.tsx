import { useState } from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";
import PageHero from "@/components/shared/PageHero";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useGalleryItems, useGalleryCategories } from "@/hooks/useGalleryItems";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectsGallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const { ref, isRevealed } = useScrollReveal<HTMLDivElement>();
  
  // Fetch data from database
  const { data: categories = [], isLoading: categoriesLoading } = useGalleryCategories();
  const { data: galleryImages = [], isLoading: imagesLoading } = useGalleryItems(
    activeCategory === "All" ? undefined : activeCategory
  );

  const allCategories = ["All", ...categories];
  const isLoading = categoriesLoading || imagesLoading;
  
  // Show items immediately when loaded - no scroll required
  const hasItems = !isLoading && galleryImages.length > 0;
  const showItems = hasItems || isRevealed;

  return (
    <PageLayout
      title="Projects Gallery"
      description="Browse STIL's portfolio of completed projects including solar installations, security systems, gates, and more across Abuja."
    >
      <PageHero
        title="Projects Gallery"
        subtitle="Explore our portfolio of completed installations across Abuja (FCT) and surrounding FCT areas."
        showCTAs={false}
      />

      {/* Category Filters */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full font-heading text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:shadow-sm"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4" ref={ref}>
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
              ))}
            </div>
          ) : !hasItems ? (
            <div className="text-center py-16 bg-muted/30 rounded-xl border border-border">
              <p className="font-body text-muted-foreground mb-4">
                {activeCategory === "All" 
                  ? "No projects added yet. Contact us to discuss your installation needs."
                  : `No projects found in "${activeCategory}" category.`}
              </p>
              <Button asChild variant="default" size="lg">
                <a href="tel:+2348064398669" className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Call Now for Details
                </a>
              </Button>
            </div>
          ) : (
            <div 
              className={`grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-700 ${
                showItems ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              {galleryImages.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  style={{ 
                    transitionDelay: showItems ? `${index * 50}ms` : "0ms",
                  }}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-block px-2 py-1 bg-secondary/90 text-secondary-foreground rounded text-xs font-heading font-medium mb-2">
                      {item.category}
                    </span>
                    <h3 className="font-heading font-semibold text-primary-foreground">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-primary-foreground mb-4">
            Want to See Your Project Here?
          </h2>
          <p className="font-body text-primary-foreground/80 mb-6 max-w-lg mx-auto">
            Let's discuss your requirements and bring your vision to life.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-heading font-semibold shadow-xl"
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

export default ProjectsGallery;
