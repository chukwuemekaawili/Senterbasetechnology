import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Import fallback static images - authentic company photos
import solarCarportReal from "@/assets/images/solar-carport-real.jpg";
import solarCarportRender from "@/assets/images/solar-carport-render.jpg";
import decorativeGate from "@/assets/images/decorative-iron-gate.jpg";
import gateMotor from "@/assets/images/gate-motor-installation.jpg";
import officePartition from "@/assets/images/office-glass-partition.jpg";
import kitchenInterior from "@/assets/images/kitchen-interior.jpg";
import securityCctv from "@/assets/images/pdf-cctv-camera.jpg";
import electricFence from "@/assets/images/electric-fence-warning.jpg";
import inverterCombiner from "@/assets/images/inverter-combiner-box.jpg";
import distributionPanel from "@/assets/images/distribution-panel.jpg";
import satelliteDish from "@/assets/images/satellite-smart-tv.jpg";
import livingRoom from "@/assets/images/living-room-interior.jpg";
import technicianFemale from "@/assets/images/technician-female-electrical.jpg";
import technicianMale from "@/assets/images/technician-male-electrical.jpg";
import windowInstall from "@/assets/images/window-installation-team.jpg";
import doorFrame from "@/assets/images/door-frame-installation.jpg";

export interface GalleryItem {
  id: string;
  title: string;
  alt: string;
  category: string;
  imageUrl: string;
  featured: boolean;
  sortOrder: number;
}

// Static fallback gallery items - authentic company photos only
const staticGalleryItems: GalleryItem[] = [
  { id: "1", title: "Solar Carport Installation", alt: "Real solar carport with metal frame structure by STIL", category: "Solar", imageUrl: solarCarportReal, featured: true, sortOrder: 1 },
  { id: "2", title: "Solar Carport Design", alt: "3D render of solar carport with photovoltaic panels", category: "Carports", imageUrl: solarCarportRender, featured: true, sortOrder: 2 },
  { id: "3", title: "Decorative Iron Gate", alt: "Decorative black iron driveway gate installation", category: "Gates/Fencing", imageUrl: decorativeGate, featured: true, sortOrder: 3 },
  { id: "4", title: "Gate Motor Installation", alt: "Automatic sliding gate motor unit by STIL technicians", category: "Gates/Fencing", imageUrl: gateMotor, featured: true, sortOrder: 4 },
  { id: "5", title: "Office Glass Partitioning", alt: "Modern office glass partition installation", category: "Interiors/Partitioning", imageUrl: officePartition, featured: true, sortOrder: 5 },
  { id: "6", title: "CCTV Security System", alt: "Professional CCTV camera installation", category: "Security", imageUrl: securityCctv, featured: true, sortOrder: 6 },
  { id: "7", title: "Electric Fence Installation", alt: "Electric fence with warning signs for perimeter security", category: "Security", imageUrl: electricFence, featured: true, sortOrder: 7 },
  { id: "8", title: "Inverter System Setup", alt: "Solar inverter and PV combiner box installation", category: "Inverter", imageUrl: inverterCombiner, featured: true, sortOrder: 8 },
  { id: "9", title: "Electrical Distribution Panel", alt: "Electrical distribution panel with switches", category: "Electrical", imageUrl: distributionPanel, featured: false, sortOrder: 9 },
  { id: "10", title: "Satellite TV Installation", alt: "Modern satellite dish with smart TV setup", category: "Satellite", imageUrl: satelliteDish, featured: false, sortOrder: 10 },
  { id: "11", title: "Living Room Interior", alt: "Modern living room interior design", category: "Interiors/Partitioning", imageUrl: livingRoom, featured: false, sortOrder: 11 },
  { id: "12", title: "Kitchen Renovation", alt: "Modern kitchen interior with teal cabinets", category: "Interiors/Partitioning", imageUrl: kitchenInterior, featured: false, sortOrder: 12 },
  { id: "13", title: "Female Electrician at Work", alt: "Nigerian female technician working on distribution panel", category: "Electrical", imageUrl: technicianFemale, featured: false, sortOrder: 13 },
  { id: "14", title: "Electrical Installation", alt: "STIL technician performing electrical installation in Abuja", category: "Electrical", imageUrl: technicianMale, featured: false, sortOrder: 14 },
  { id: "15", title: "Window Installation Team", alt: "Construction team installing windows with safety gear", category: "Interiors/Partitioning", imageUrl: windowInstall, featured: false, sortOrder: 15 },
  { id: "16", title: "Door Frame Installation", alt: "Technician installing door frame with nail gun", category: "Interiors/Partitioning", imageUrl: doorFrame, featured: false, sortOrder: 16 },
];


// Fetch all gallery items - use static authentic images to avoid stock DB URLs
export const useGalleryItems = (category?: string) => {
  return useQuery({
    queryKey: ["galleryItems", category],
    queryFn: async (): Promise<GalleryItem[]> => {
      // Always return static authentic images - database contains stock URLs
      if (category && category !== "All") {
        return staticGalleryItems.filter(item => item.category === category);
      }
      return staticGalleryItems;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

// Fetch featured gallery items for homepage - use static authentic images
export const useFeaturedGalleryItems = (limit: number = 10) => {
  return useQuery({
    queryKey: ["featuredGalleryItems", limit],
    queryFn: async (): Promise<GalleryItem[]> => {
      // Always return static authentic images - database contains stock URLs
      return staticGalleryItems.filter(item => item.featured).slice(0, limit);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

// Get unique categories from gallery items
export const useGalleryCategories = () => {
  return useQuery({
    queryKey: ["galleryCategories"],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("category")
        .eq("published", true);

      if (error || !data || data.length === 0) {
        return [...new Set(staticGalleryItems.map(item => item.category))];
      }

      const categories = [...new Set(data.map(item => item.category))];
      return categories.sort();
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};
