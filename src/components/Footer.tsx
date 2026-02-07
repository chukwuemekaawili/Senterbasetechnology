import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteSettings, formatPhoneDisplay } from "@/hooks/useSiteSettings";
import { AdminEditButton } from "@/components/admin/AdminEditButton";
import stilLogo from "@/assets/images/stil-logo.png";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/projects-gallery" },
  { label: "Coverage Areas", href: "/coverage-areas" },
  { label: "Contact", href: "/contact" },
];

const services = [
  "Smart Security",
  "Solar Energy",
  "General Electrical",
  "Electronic Gates",
  "Electric Fencing",
  "Carport Installation",
];

const Footer = () => {
  const { data: settings } = useSiteSettings();

  const phone = settings?.phone || "+2348064398669";
  const email = settings?.email || "senterbase@gmail.com";
  const address = settings?.address || "No 7 Port Harcourt Crescent, Area 11, Abuja";
  const socialFacebook = settings?.social_facebook;
  const socialInstagram = settings?.social_instagram;
  const socialTwitter = settings?.social_twitter;
  const logoUrl = settings?.logo_url;
  const siteTitle = settings?.site_title || "STIL";

  return (
    <footer id="contact" className="bg-primary text-primary-foreground relative">
      {/* Admin Edit Button */}
      <div className="absolute top-4 right-4 z-10">
        <AdminEditButton href="/admin/settings" label="Edit Footer" />
      </div>
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <img 
              src={logoUrl || stilLogo} 
              alt={siteTitle}
              className="h-12 w-auto object-contain mb-4 brightness-0 invert"
            />
            <p className="font-body text-sm text-primary-foreground/80 mb-6">
              Senterbase Technology & Investment Ltd. We deliver innovative, reliable, and sustainable technology and electrical solutions.
            </p>
            <div className="flex gap-4">
              <a
                href={socialFacebook || "#"}
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={socialInstagram || "#"}
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={socialTwitter || "#"}
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="font-body text-sm text-primary-foreground/80 hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="font-body text-sm text-primary-foreground/80 hover:text-secondary transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${phone}`}
                  className="flex items-start gap-3 font-body text-sm text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  <Phone className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span>{formatPhoneDisplay(phone)}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-3 font-body text-sm text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  <Mail className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span>{email}</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 font-body text-sm text-primary-foreground/80">
                  <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span>{address}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body text-sm text-primary-foreground/60">
              © {new Date().getFullYear()} Senterbase Technology & Investment Ltd. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                to="/privacy"
                className="font-body text-sm text-primary-foreground/60 hover:text-secondary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="font-body text-sm text-primary-foreground/60 hover:text-secondary transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
