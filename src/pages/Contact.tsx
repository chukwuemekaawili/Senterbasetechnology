import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Phone, Mail, MapPin, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import PageLayout from "@/components/layout/PageLayout";
import PageHero from "@/components/shared/PageHero";
import { AdminEditButton } from "@/components/admin/AdminEditButton";
import { usePageSections } from "@/hooks/usePageSections";
import { services } from "@/data/services";
import { useLeadSubmission } from "@/hooks/useLeadSubmission";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  phone: z.string().trim().min(10, "Please enter a valid phone number").max(20, "Phone number too long"),
  email: z.string().trim().email("Please enter a valid email").max(255).optional().or(z.literal("")),
  service: z.string().min(1, "Please select a service"),
  location: z.string().trim().min(1, "Location is required").max(200, "Location must be less than 200 characters"),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message must be less than 1000 characters"),
});

const Contact = () => {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get("service") || "";
  const { data: sections } = usePageSections("contact");
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: preselectedService,
    location: "",
    message: "",
  });
  
  // Honeypot field - hidden from users, bots will fill it
  const [honeypot, setHoneypot] = useState("");
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const { submitLead, isSubmitting } = useLeadSubmission();

  // Get sections
  const introSection = sections?.find(s => s.section_key === "intro");
  const coverageSection = sections?.find(s => s.section_key === "coverage");

  // Update service if URL param changes
  useEffect(() => {
    if (preselectedService) {
      setFormData(prev => ({ ...prev, service: preselectedService }));
    }
  }, [preselectedService]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError(null);

    try {
      const validated = contactSchema.parse(formData);
      
      const result = await submitLead({
        name: validated.name,
        phone: validated.phone,
        email: validated.email || undefined,
        service: validated.service,
        location: validated.location,
        message: validated.message,
        source_page: "/contact",
      }, honeypot);

      if (result.success) {
        setIsSubmitted(true);
      } else {
        setSubmitError(result.error || "Failed to submit. Please try again.");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <PageLayout
      title="Contact Us"
      description="Get in touch with STIL for quotes, consultations, and service inquiries. Call 0806 439 8669 for fastest response."
    >
      <PageHero
        title="Contact Us"
        subtitle="Get in touch with our team for quotes, consultations, and service inquiries."
      />

      <section className="py-16 md:py-20 relative">
        <div className="absolute top-4 right-4 z-10">
          <AdminEditButton href="/admin/pages" label="Edit Content" />
        </div>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                {introSection?.title || "Get in Touch"}
              </h2>
              <p className="font-body text-muted-foreground mb-8">
                {introSection?.body_text || "Have a project in mind? Need a quote or consultation? We're here to help. For the fastest response, give us a call."}
              </p>

              <div className="space-y-6 mb-8">
                <a
                  href="tel:+2348064398669"
                  className="flex items-start gap-4 p-4 bg-secondary/10 rounded-xl border border-secondary/20 hover:bg-secondary/20 transition-colors"
                >
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">Phone (Fastest)</h3>
                    <p className="font-body text-lg text-secondary font-medium">0806 439 8669</p>
                    <p className="font-body text-sm text-muted-foreground">Click to call</p>
                  </div>
                </a>

                <a
                  href="mailto:senterbase@gmail.com"
                  className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border/50 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">Email</h3>
                    <p className="font-body text-primary">senterbase@gmail.com</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border/50">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">Office Address</h3>
                    <p className="font-body text-muted-foreground">
                      No 7 Port Harcourt Crescent,<br />
                      Area 11, Abuja
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-6 border border-border/50">
                <h3 className="font-heading font-semibold text-foreground mb-2">
                  {coverageSection?.title || "Coverage Area"}
                </h3>
                <p className="font-body text-muted-foreground">
                  {coverageSection?.body_text || "We serve Abuja (FCT) and surrounding FCT areas. Call to confirm availability for your specific location."}
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-lg">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                    Thank You!
                  </h3>
                  <p className="font-body text-muted-foreground mb-6">
                    Your request has been received. We'll get back to you shortly.
                  </p>
                  <div className="bg-secondary/10 rounded-lg p-4 border border-secondary/20 mb-4">
                    <p className="font-body text-sm text-muted-foreground mb-2">
                      For fastest response, call us directly:
                    </p>
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
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-heading text-xl font-bold text-foreground mb-6">
                    Request a Quote
                  </h2>
                  
                  {submitError && (
                    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6">
                      <p className="font-body text-sm text-destructive">{submitError}</p>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Honeypot field - hidden from users */}
                    <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
                      <label htmlFor="company_website">Company Website</label>
                      <input
                        type="text"
                        id="company_website"
                        name="company_website"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    <div>
                      <Label htmlFor="name" className="font-heading font-medium">
                        Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Your full name"
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="font-heading font-medium">
                        Phone <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="Your phone number"
                        className={errors.phone ? "border-destructive" : ""}
                      />
                      {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <Label htmlFor="email" className="font-heading font-medium">
                        Email <span className="text-muted-foreground">(optional)</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="your@email.com"
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="service" className="font-heading font-medium">
                        Service Required <span className="text-destructive">*</span>
                      </Label>
                      <Select value={formData.service} onValueChange={(value) => handleChange("service", value)}>
                        <SelectTrigger className={errors.service ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.slug} value={service.slug}>
                              {service.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.service && <p className="text-sm text-destructive mt-1">{errors.service}</p>}
                    </div>

                    <div>
                      <Label htmlFor="location" className="font-heading font-medium">
                        Location <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleChange("location", e.target.value)}
                        placeholder="Your area/location in Abuja"
                        className={errors.location ? "border-destructive" : ""}
                      />
                      {errors.location && <p className="text-sm text-destructive mt-1">{errors.location}</p>}
                    </div>

                    <div>
                      <Label htmlFor="message" className="font-heading font-medium">
                        Message <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        placeholder="Describe your project or requirements..."
                        rows={4}
                        className={errors.message ? "border-destructive" : ""}
                      />
                      {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 font-heading font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Request
                        </>
                      )}
                    </Button>
                  </form>

                  <p className="font-body text-sm text-muted-foreground text-center mt-4">
                    For fastest response, call{" "}
                    <a href="tel:+2348064398669" className="text-secondary font-medium">
                      0806 439 8669
                    </a>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;
