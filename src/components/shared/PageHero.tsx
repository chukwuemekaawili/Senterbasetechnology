import { Phone, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  showCTAs?: boolean;
  backgroundImage?: string;
}

const PageHero = ({ title, subtitle, showCTAs = true, backgroundImage }: PageHeroProps) => {
  return (
    <section 
      className="relative py-20 md:py-28 overflow-hidden"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90" />
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="font-body text-lg md:text-xl text-primary-foreground/90 mb-8">
              {subtitle}
            </p>
          )}
          {showCTAs && (
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
                <a href="/contact" className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Request Quote
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
