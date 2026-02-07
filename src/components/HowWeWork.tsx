import { MessageSquare, MapPin, Hammer, CheckCircle, HeadphonesIcon } from "lucide-react";
import { AdminEditButton } from "@/components/admin/AdminEditButton";

const steps = [
  {
    icon: MessageSquare,
    title: "Consult",
    description: "Free consultation to understand your needs and requirements",
  },
  {
    icon: MapPin,
    title: "Survey",
    description: "On-site assessment to plan the perfect solution for your property",
  },
  {
    icon: Hammer,
    title: "Install",
    description: "Professional installation by our skilled technicians and engineers",
  },
  {
    icon: CheckCircle,
    title: "Test",
    description: "Thorough testing to ensure safety, functionality, and performance",
  },
  {
    icon: HeadphonesIcon,
    title: "Support",
    description: "Ongoing maintenance and support for long-lasting results",
  },
];

const HowWeWork = () => {
  return (
    <section className="py-20 bg-primary relative">
      {/* Admin Edit Button */}
      <div className="absolute top-4 right-4 z-10">
        <AdminEditButton href="/admin/pages" label="Edit Content" />
      </div>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            How We Work
          </h2>
          <p className="font-body text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Our proven 5-step process ensures quality, professionalism, and reliability in every project
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-secondary/30" />
              )}

              {/* Icon Circle */}
              <div className="relative z-10 w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center mb-4 shadow-lg">
                <step.icon className="w-8 h-8 text-secondary-foreground" />
              </div>

              {/* Step Number */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-6 h-6 bg-primary-foreground text-primary rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>

              {/* Content */}
              <h3 className="font-heading text-xl font-bold text-primary-foreground mb-2">
                {step.title}
              </h3>
              <p className="font-body text-sm text-primary-foreground/70">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;
