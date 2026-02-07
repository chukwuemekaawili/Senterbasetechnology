import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import stilLogo from "@/assets/images/stil-logo.png";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/projects-gallery" },
  { label: "Contact", href: "/contact" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: settings } = useSiteSettings();
  const location = useLocation();

  const isActiveLink = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const phoneNumber = settings?.phone || "+2348064398669";
  const ctaLabel = settings?.primary_cta_label || "Call Now";
  const logoUrl = settings?.logo_url;
  const siteTitle = settings?.site_title || "STIL";

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0B2F5B]/90 backdrop-blur-md shadow-lg border-b border-white/10"
            : "bg-[#0B2F5B]/55 backdrop-blur-md border-b border-white/10"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Admin managed or local fallback */}
            <Link to="/" className="flex items-center gap-2">
              <img 
                src={logoUrl || stilLogo} 
                alt={siteTitle}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={cn(
                    "font-body text-sm font-medium transition-colors relative",
                    isActiveLink(link.href)
                      ? "text-white font-semibold"
                      : "text-white/70 hover:text-white"
                  )}
                >
                  {link.label}
                  {isActiveLink(link.href) && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-secondary rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="flex items-center gap-4">
              <Button
                asChild
                className="hidden sm:flex bg-secondary hover:bg-secondary/90 text-secondary-foreground font-heading font-semibold shadow-lg"
              >
                <a href={`tel:${phoneNumber}`} className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {ctaLabel}
                </a>
              </Button>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2 text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#0B2F5B]/95 backdrop-blur-md border-t border-white/10">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={cn(
                    "font-body text-base font-medium transition-colors py-2",
                    isActiveLink(link.href)
                      ? "text-white font-semibold border-l-2 border-secondary pl-3"
                      : "text-white/70 hover:text-white pl-3"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Mobile Floating Call Button */}
      <a
        href={`tel:${phoneNumber}`}
        className="fixed bottom-6 right-6 z-50 lg:hidden flex items-center justify-center w-14 h-14 bg-secondary text-secondary-foreground rounded-full shadow-2xl hover:scale-110 transition-transform"
        aria-label={ctaLabel}
      >
        <Phone className="w-6 h-6" />
      </a>
    </>
  );
};

export default Header;
