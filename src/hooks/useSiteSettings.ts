import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Default site settings (fallback if DB is empty)
const defaultSettings = {
  phone: "+2348064398669",
  email: "senterbase@gmail.com",
  address: "No 7 Port Harcourt Crescent, Area 11, Abuja",
  primary_cta_label: "Call Now",
  coverage_statement: "Abuja (FCT) and surrounding FCT areas",
  site_title: "STIL Technologies",
  meta_description: "Professional solar, security, electrical and home improvement services in Abuja",
  social_facebook: null as string | null,
  social_twitter: null as string | null,
  social_instagram: null as string | null,
  logo_url: null as string | null,
  logo_dark_url: null as string | null,
  og_image_url: null as string | null,
  hero_image_url: null as string | null,
  whatsapp_number: null as string | null,
};

export type SiteSettings = typeof defaultSettings;

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["siteSettings"],
    queryFn: async (): Promise<SiteSettings> => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching site settings:", error);
        return defaultSettings;
      }

      if (!data) {
        return defaultSettings;
      }

      return {
        phone: data.phone || defaultSettings.phone,
        email: data.email || defaultSettings.email,
        address: data.address || defaultSettings.address,
        primary_cta_label: data.primary_cta_label || defaultSettings.primary_cta_label,
        coverage_statement: data.coverage_statement || defaultSettings.coverage_statement,
        site_title: data.site_title || defaultSettings.site_title,
        meta_description: data.meta_description || defaultSettings.meta_description,
        social_facebook: data.social_facebook,
        social_twitter: data.social_twitter,
        social_instagram: data.social_instagram,
        logo_url: data.logo_url,
        logo_dark_url: data.logo_dark_url,
        og_image_url: data.og_image_url,
        hero_image_url: data.hero_image_url,
        whatsapp_number: data.whatsapp_number,
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

// Helper to format phone for display
export const formatPhoneDisplay = (phone: string): string => {
  // Convert +2348064398669 to 0806 439 8669
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("234")) {
    const local = "0" + cleaned.slice(3);
    return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`;
  }
  return phone;
};
