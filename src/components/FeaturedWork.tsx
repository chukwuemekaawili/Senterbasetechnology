import { ArrowRight, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useFeaturedGalleryItems } from "@/hooks/useGalleryItems";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedWork = () => {
  const { data: featuredItems, isLoading } = useFeaturedGalleryItems(6);

  const hasItems = featuredItems && featuredItems.length > 0;

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Skeleton className="h-8 w-56 mx-auto mb-3" />
            <Skeleton className="h-5 w-80 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!hasItems) {
    return null; // Don't show section if no featured items
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">
            Featured Work
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Recent projects showcasing our quality craftsmanship
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden rounded-lg shadow-md"
            >
              <img
                src={item.imageUrl}
                alt={item.alt || item.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-primary-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-xs font-medium text-secondary uppercase tracking-wide">
                  {item.category}
                </span>
                <h3 className="font-heading font-semibold text-sm">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            asChild
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-heading font-semibold"
          >
            <a href="tel:+2348064398669" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Call for Quote
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-heading font-semibold"
          >
            <Link to="/projects-gallery" className="flex items-center gap-2">
              View All Projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedWork;
