import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { AdminEditButton } from "@/components/admin/AdminEditButton";
import { Skeleton } from "@/components/ui/skeleton";

// Fallback team member photos for initial seed
import engrIdrisSaliu from "@/assets/images/team/engr-idris-saliu.png";
import engrSulaiman from "@/assets/images/team/engr-sulaiman.png";
import hauwaIdris from "@/assets/images/team/hauwa-idris.png";
import mrIsahSiyaka from "@/assets/images/team/mr-isah-siyaka.png";
import abdulMumeen from "@/assets/images/team/abdul-mumeen.png";

// Fallback data when CMS is empty
const fallbackMembers = [
  { name: "Engr. Idris Saliu", role: "Founder", image: engrIdrisSaliu, position: "object-top" },
  { name: "Engr. Sulaiman", role: "Site Operation Manager", image: engrSulaiman, position: "object-top" },
  { name: "Hauwa Idris", role: "Director", image: hauwaIdris, position: "object-top" },
  { name: "Mr. Isah Siyaka O.", role: "Board of Trustee", image: mrIsahSiyaka, position: "object-[center_20%]" },
  { name: "Abdul Mumeen", role: "Project Manager", image: abdulMumeen, position: "object-[center_25%]" },
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
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const TeamMembers = () => {
  const { data: cmsMembers, isLoading, error } = useTeamMembers();

  // Use CMS data if available, otherwise fallback to hardcoded
  const useCmsData = cmsMembers && cmsMembers.length > 0;
  const displayMembers = useCmsData
    ? cmsMembers.filter((m) => m.published)
    : fallbackMembers;

  return (
    <section className="py-16 md:py-20 bg-muted/50 relative">
      {/* Admin Edit Button */}
      <div className="absolute top-4 right-4 z-10">
        <AdminEditButton href="/admin/team" label="Edit Team" />
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
            Meet Our Team
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            The leadership driving STIL's mission forward
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="w-40 h-40 rounded-full mb-4" />
                <Skeleton className="w-24 h-4 mb-2" />
                <Skeleton className="w-20 h-3" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {displayMembers.map((member, index) => {
              const isCms = useCmsData;
              const imageUrl = isCms
                ? (member as any).image_url
                : (member as any).image;
              const position = isCms ? "object-top" : (member as any).position;

              return (
                <motion.div
                  key={isCms ? (member as any).id : member.name}
                  variants={itemVariants}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="relative mb-4">
                    <div className="w-40 h-40 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 bg-muted">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`${member.name} - ${member.role} at STIL`}
                          className={`w-full h-full object-cover ${position}`}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-16 h-16 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="font-heading font-semibold text-foreground text-sm md:text-base mb-1">
                    {member.name}
                  </h3>
                  <p className="font-body text-xs md:text-sm text-muted-foreground">
                    {member.role}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TeamMembers;
