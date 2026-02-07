import PageLayout from "@/components/layout/PageLayout";
import PageHero from "@/components/shared/PageHero";
import { AdminEditButton } from "@/components/admin/AdminEditButton";

const Privacy = () => {
  const lastUpdated = "January 23, 2026";

  return (
    <PageLayout
      title="Privacy Policy"
      description="Privacy Policy for Senterbase Technology & Investment Ltd (STIL) - How we collect, use, and protect your information."
    >
      <PageHero
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your information."
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
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">1. Introduction</h2>
                <p>
                  Senterbase Technology & Investment Ltd ("STIL", "we", "our", or "us") is committed to 
                  protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard 
                  your information when you use our services or visit our website.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">2. Information We Collect</h2>
                <p>We may collect the following types of information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">Contact Information:</strong> Name, phone number, email address, and physical address when you request a quote or contact us.</li>
                  <li><strong className="text-foreground">Service Information:</strong> Details about the services you're interested in and project requirements.</li>
                  <li><strong className="text-foreground">Communication Records:</strong> Records of our communications with you, including phone calls, emails, and messages.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
                <p>We use your information to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Respond to your inquiries and provide quotes</li>
                  <li>Deliver the services you request</li>
                  <li>Communicate about your projects and appointments</li>
                  <li>Improve our services and customer experience</li>
                  <li>Send relevant updates about our services (with your consent)</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">4. Information Sharing</h2>
                <p>
                  We do not sell, trade, or rent your personal information to third parties. We may share 
                  your information only in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>With your consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and safety</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">5. Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information from 
                  unauthorized access, alteration, disclosure, or destruction.
                </p>
              </div>

              <div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">6. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal information</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt out of marketing communications</li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">7. Contact Us</h2>
                <p>
                  If you have questions about this Privacy Policy or our data practices, please contact us:
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

export default Privacy;
