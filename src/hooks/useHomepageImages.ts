import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Local fallback images - authentic company photos
import fallbackHeroImage from "@/assets/images/hero-security.jpg";
import fallbackSecurityImage from "@/assets/images/pdf-cctv-camera.jpg";
import fallbackSolarImage from "@/assets/images/solar-carport-real.jpg";
import fallbackElectricalImage from "@/assets/images/technician-female-electrical.jpg";
import fallbackMapImage from "@/assets/images/stock-abuja-map.jpg";
import fallbackShowcaseImage from "@/assets/images/solar-carport-real.jpg";

export interface HomepageImages {
  hero: string;
  highlightSecurity: string;
  highlightSolar: string;
  highlightElectrical: string;
  coverageMap: string;
  showcase: string;
}

const defaultImages: HomepageImages = {
  hero: fallbackHeroImage,
  highlightSecurity: fallbackSecurityImage,
  highlightSolar: fallbackSolarImage,
  highlightElectrical: fallbackElectricalImage,
  coverageMap: fallbackMapImage,
  showcase: fallbackShowcaseImage,
};

/**
 * Fetches homepage images from media_assets by category.
 * Falls back to local stock images if DB fetch fails or returns nothing.
 */
export const useHomepageImages = () => {
  return useQuery({
    queryKey: ["homepageImages"],
    queryFn: async (): Promise<HomepageImages> => {
      try {
        // Fetch specific categories for homepage sections
        const { data, error } = await supabase
          .from("media_assets")
          .select("category, public_url, title")
          .in("category", ["Hero", "Security", "Solar", "Electrical", "Coverage", "Showcase"])
          .limit(12);

        if (error) {
          console.error("[useHomepageImages] Fetch error:", error);
          return defaultImages;
        }

        if (!data || data.length === 0) {
          return defaultImages;
        }

        // Map by category - take first match per category
        const byCategory: Record<string, string> = {};
        data.forEach((item) => {
          if (item.category && item.public_url && !byCategory[item.category]) {
            byCategory[item.category] = item.public_url;
          }
        });

        return {
          hero: byCategory["Hero"] || defaultImages.hero,
          highlightSecurity: byCategory["Security"] || defaultImages.highlightSecurity,
          highlightSolar: byCategory["Solar"] || defaultImages.highlightSolar,
          highlightElectrical: byCategory["Electrical"] || defaultImages.highlightElectrical,
          coverageMap: byCategory["Coverage"] || defaultImages.coverageMap,
          showcase: byCategory["Showcase"] || defaultImages.showcase,
        };
      } catch (err) {
        console.error("[useHomepageImages] Unexpected error:", err);
        return defaultImages;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 1,
  });
};

// Export defaults for direct use as fallbacks
export { defaultImages };
