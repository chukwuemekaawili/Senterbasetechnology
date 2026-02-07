import PageLayout from "@/components/layout/PageLayout";
import PageHero from "@/components/shared/PageHero";
import { AdminEditButton } from "@/components/admin/AdminEditButton";

const Terms = () => {
  const lastUpdated = "January 23, 2026";

  return (
    <PageLayout
      title="Terms of Service"
      description="Terms of Service for Senterbase Technology & Investment Ltd (STIL) - Terms and conditions governing the use of our services."
    >
      <PageHero
        title="Terms of Service"
        subtitle="Terms and conditions governing the use of our services."
        showCTAs={false}
      />

      <section className="py-16 md:py-20 relative">
        <div className="absolute top-4 right-4 z-10">
          <AdminEditButton href="/admin/pages" label="Edit Content" />
        </div>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <div className="space-y-8 font-body text-muted-foreground">
              <p className="text-sm">
                <strong className="text-foreground">Last Updated:</strong> {lastUpdated}
              </p>

              <div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">1. Agreement to Terms</h2>
                <p>
                  By engaging Senterbase Technology & Investment Ltd ("STIL", "we", "our", or "us") for 
                  any services, you agree to be bound by these Terms of Service. If you do not agree to 
                  these terms, please do not use our services.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">2. Services</h2>
                <p>
                  STIL provides technology and electrical services including but not limited to: smart 
                  security systems, solar energy installation, electrical work, gate installation, and 
                  interior partitioning. Services are subject to availability in your location within 
                  Abuja (FCT) and surrounding FCT areas.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">3. Quotes and Pricing</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All quotes provided are estimates based on the information available at the time.</li>
                  <li>Final pricing may vary based on actual site conditions and requirements.</li>
                  <li>Quotes are valid for 30 days unless otherwise specified.</li>
                  <li>Payment terms will be agreed upon before work commences.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">4. Service Delivery</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We will make reasonable efforts to complete work within agreed timeframes.</li>
                  <li>Completion times may be affected by factors beyond our control.</li>
                  <li>Clients must provide reasonable access to the work site.</li>
                  <li>Any changes to the scope of work may affect pricing and timeline.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">5. Warranties</h2>
                <p>
                  We stand behind our work and provide warranties on installations as specified in 
                  individual service agreements. Warranty terms vary by service type and will be 
                  communicated at the time of service.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">6. Limitation of Liability</h2>
                <p>
                  STIL's liability is limited to the value of services provided. We are not liable for 
                  indirect, incidental, or consequential damages arising from our services. This does 
                  not affect your statutory rights.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">7. Client Responsibilities</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate information about your requirements and site conditions.</li>
                  <li>Ensure safe access to the work site for our technicians.</li>
                  <li>Obtain necessary permissions or approvals for work on your property.</li>
                  <li>Make timely payments as agreed.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">8. Cancellation</h2>
                <p>
                  Cancellation policies vary by service type. Please contact us to discuss cancellation 
                  terms for your specific project. Cancellation may be subject to fees for work already 
                  completed or materials ordered.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">9. Governing Law</h2>
                <p>
                  These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes 
                  will be resolved through appropriate legal channels in Abuja, FCT.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">10. Contact Us</h2>
                <p>
                  For questions about these Terms of Service, please contact us:
                </p>
                <ul className="list-none pl-0 space-y-2 mt-4">
                  <li><strong className="text-foreground">Phone:</strong> 0806 439 8669</li>
                  <li><strong className="text-foreground">Email:</strong> senterbase@gmail.com</li>
                  <li><strong className="text-foreground">Address:</strong> No 7 Port Harcourt Crescent, Area 11, Abuja</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Terms;
