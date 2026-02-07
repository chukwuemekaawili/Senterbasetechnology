import { AlertTriangle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminEditButton } from "@/components/admin/AdminEditButton";

const SafetyDisclaimer = () => {
  return (
    <section className="py-10 bg-amber-50 dark:bg-amber-950/30 border-y border-amber-200 dark:border-amber-800/50 relative">
      {/* Admin Edit Button */}
      <div className="absolute top-2 right-4 z-10">
        <AdminEditButton href="/admin/pages" label="Edit Content" />
      </div>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground mb-1">
                Safety Notice
              </h3>
              <p className="font-body text-sm text-muted-foreground max-w-2xl">
                Electrical, solar, and security installations should only be handled by certified technicians. 
                Improper installation can cause safety hazards. Contact STIL for professional service.
              </p>
            </div>
          </div>
          <Button
            asChild
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-heading font-semibold flex-shrink-0"
          >
            <a href="tel:+2348064398669" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Call Now
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SafetyDisclaimer;
