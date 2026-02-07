import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminEditButton } from "@/components/admin/AdminEditButton";
import { useTestimonials } from "@/hooks/useTestimonials";

// Fallback testimonials if database is empty
const fallbackTestimonials = [
  {
    id: "1",
    name: "Engr. Chukwuma Okonkwo",
    role: "Estate Developer, Abuja",
    content: "STIL transformed our entire estate with reliable solar installations. Their professionalism and attention to detail exceeded our expectations. Highly recommended!",
    rating: 5,
    initials: "CO",
  },
  {
    id: "2",
    name: "Mrs. Aisha Mohammed",
    role: "Homeowner, Maitama",
    content: "The CCTV and electric fence installation by STIL gives me peace of mind. The team was punctual, professional, and their after-sales support is excellent.",
    rating: 5,
    initials: "AM",
  },
  {
    id: "3",
    name: "Chief Emeka Nwosu",
    role: "Business Owner, Garki",
    content: "We've worked with STIL on multiple projects - from automated gates to inverter systems. Consistent quality and fair pricing every single time.",
    rating: 5,
    initials: "EN",
  },
  {
    id: "4",
    name: "Dr. Fatima Bello",
    role: "Clinic Director, Wuse",
    content: "Power reliability is critical for our clinic. STIL's solar and inverter solution has been running flawlessly for 2 years now. Outstanding service!",
    rating: 5,
    initials: "FB",
  },
];

const Testimonials = () => {
  const { data: dbTestimonials, isLoading } = useTestimonials();
  const testimonials = dbTestimonials && dbTestimonials.length > 0 
    ? dbTestimonials.filter(t => t.published) 
    : fallbackTestimonials;

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  // Auto-play functionality
  useEffect(() => {
    if (!isPaused && testimonials.length > 1) {
      intervalRef.current = setInterval(() => {
        next();
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, current, testimonials.length]);

  // Reset current if testimonials change
  useEffect(() => {
    if (current >= testimonials.length) {
      setCurrent(0);
    }
  }, [testimonials.length, current]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto h-64 bg-muted/50 animate-pulse rounded-2xl" />
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  const currentTestimonial = testimonials[current];

  return (
    <section className="py-20 bg-muted/30 overflow-hidden relative">
      {/* Admin Edit Button */}
      <div className="absolute top-4 right-4 z-10">
        <AdminEditButton href="/admin/testimonials" label="Edit Testimonials" />
      </div>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Clients Say
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by homeowners and businesses across Abuja (FCT)
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleMouseEnter}
          onTouchEnd={handleMouseLeave}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-card rounded-2xl p-8 md:p-12 shadow-lg border border-border/50 relative"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 left-6 w-12 h-12 text-secondary/20" />

              {/* Content */}
              <div className="relative z-10">
                {/* Avatar and Verified Badge */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                      <span className="font-heading font-bold text-xl text-primary-foreground">
                        {currentTestimonial.initials}
                      </span>
                    </div>
                    {/* Verified Badge */}
                    <div className="absolute -bottom-1 -right-1 bg-secondary rounded-full p-1">
                      <BadgeCheck className="w-4 h-4 text-secondary-foreground" />
                    </div>
                  </div>
                </div>

                {/* Verified Client Label */}
                <div className="flex justify-center mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-heading font-semibold">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Verified Client
                  </span>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6 justify-center">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                  ))}
                </div>

                <blockquote className="font-body text-lg md:text-xl text-foreground text-center mb-8 leading-relaxed">
                  "{currentTestimonial.content}"
                </blockquote>

                <div className="text-center">
                  <p className="font-heading font-semibold text-foreground">
                    {currentTestimonial.name}
                  </p>
                  <p className="font-body text-sm text-muted-foreground">
                    {currentTestimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prev}
                className="rounded-full border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              {/* Dots with Progress Indicator */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === current 
                        ? "bg-secondary w-8" 
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2.5"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={next}
                className="rounded-full border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Auto-play indicator */}
          {testimonials.length > 1 && (
            <p className="text-center text-xs text-muted-foreground mt-4">
              {isPaused ? "Paused" : "Auto-playing"} • Hover to pause
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
