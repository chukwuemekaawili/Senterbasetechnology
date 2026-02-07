import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Phone, ArrowRight, Home, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <span className="text-8xl font-heading font-bold text-primary">404</span>
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground mb-3">
          Page Not Found
        </h1>
        <p className="font-body text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let us help you get back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            asChild
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-heading font-semibold"
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
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-heading font-semibold"
          >
            <Link to="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Go Home
            </Link>
          </Button>
        </div>

        <div className="border-t border-border pt-6">
          <p className="font-body text-sm text-muted-foreground mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/services"
              className="font-body text-sm text-primary hover:text-secondary underline flex items-center gap-1"
            >
              View Services <ArrowRight className="w-3 h-3" />
            </Link>
            <Link
              to="/contact"
              className="font-body text-sm text-primary hover:text-secondary underline flex items-center gap-1"
            >
              Contact Us <ArrowRight className="w-3 h-3" />
            </Link>
            <Link
              to="/projects-gallery"
              className="font-body text-sm text-primary hover:text-secondary underline flex items-center gap-1"
            >
              Our Work <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
