import { motion } from "framer-motion";
import { Shield, ThumbsUp, Zap, Wrench, Clock, Users, HeadphonesIcon } from "lucide-react";
import { AdminEditButton } from "@/components/admin/AdminEditButton";

const trustBadges = [
  { icon: Shield, label: "Safety First" },
  { icon: ThumbsUp, label: "Reliable" },
  { icon: Zap, label: "Fast Response" },
  { icon: Wrench, label: "Maintenance Support" },
];

const valueProps = [
  {
    icon: Shield,
    title: "Licensed & Insured",
    description: "Fully registered with qualified technicians for all installations.",
  },
  {
    icon: Clock,
    title: "Timely Delivery",
    description: "We respect your schedule and complete projects on time.",
  },
  {
    icon: Users,
    title: "Experienced Team",
    description: "Skilled professionals with years of field experience.",
  },
  {
    icon: ThumbsUp,
    title: "Quality Guarantee",
    description: "We stand behind our work with solid warranties.",
  },
  {
    icon: HeadphonesIcon,
    title: "After-Sales Support",
    description: "Ongoing maintenance and support for all installations.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const TrustAndCredibility = () => {
  return (
    <section className="py-16 bg-muted/50 relative">
      {/* Admin Edit Button */}
      <div className="absolute top-4 right-4 z-10">
        <AdminEditButton href="/admin/pages" label="Edit Content" />
      </div>
      <div className="container mx-auto px-4">
        {/* Trust Badges Strip */}
        <motion.div
          className="bg-primary rounded-2xl py-5 px-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {trustBadges.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2.5 text-primary-foreground"
              >
                <item.icon className="w-5 h-5 text-secondary" />
                <span className="font-heading font-semibold text-sm md:text-base">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">
            Why Clients Choose STIL
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Professional service you can trust across Abuja (FCT)
          </p>
        </motion.div>

        {/* Value Props Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {valueProps.map((prop) => (
            <motion.div
              key={prop.title}
              variants={itemVariants}
              className="bg-card rounded-xl p-5 text-center shadow-sm border border-border/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <prop.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-1.5 text-sm">
                {prop.title}
              </h3>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">
                {prop.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustAndCredibility;
