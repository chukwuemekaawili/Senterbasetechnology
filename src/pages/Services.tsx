import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import PageHero from "@/components/shared/PageHero";
import { useServices } from "@/hooks/useServices";
import { Skeleton } from "@/components/ui/skeleton";

const Services = () => {
  const { data: services, isLoading } = useServices();

  return (
    <PageLayout
      title="Our Services"
      description="Explore STIL's comprehensive technology and electrical services including smart security, solar energy, general electrical, gates, and more."
    >
      <PageHero
        title="Our Services"
        subtitle="Comprehensive technology and electrical solutions for residential, commercial, and government clients across Abuja (FCT) and surrounding FCT areas."
      />

      {/* Services Grid */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl p-6 border border-border/50">
                  <Skeleton className="w-14 h-14 rounded-xl mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services?.map((service) => (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  className="group bg-card rounded-xl p-6 border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                    <service.icon className="w-7 h-7 text-primary group-hover:text-secondary transition-colors" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground mb-4">
                    {service.shortDescription}
                  </p>
                  <div className="flex items-center gap-2 text-primary font-heading font-medium text-sm">
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Coverage Note */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <p className="font-body text-muted-foreground">
            All services available across <strong className="text-foreground">Abuja (FCT) and surrounding FCT areas</strong>.
            <br />
            <Link to="/coverage-areas" className="text-primary hover:underline">View coverage details</Link>
          </p>
        </div>
      </section>
    </PageLayout>
  );
};

export default Services;
