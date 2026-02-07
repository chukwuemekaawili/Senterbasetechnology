import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CTAButton {
  label: string;
  href: string;
  variant: "primary" | "secondary" | "outline" | "ghost";
}

export interface HeroContent {
  id: string;
  title: string | null;
  subtitle: string | null;
  body_text: string | null;
  image_url: string | null;
  ctas: CTAButton[];
}

export function useHeroContent() {
  return useQuery({
    queryKey: ["hero-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_sections")
        .select(`
          id,
          title,
          subtitle,
          body_text,
          ctas_json,
          image_asset_id,
          media_assets!page_sections_image_asset_id_fkey (
            public_url
          )
        `)
        .eq("page_slug", "home")
        .eq("section_key", "hero")
        .single();

      if (error) {
        // If no hero section exists, return defaults
        if (error.code === "PGRST116") {
          return {
            id: "",
            title: "Powering Secure, Modern Living",
            subtitle: "STIL Nigeria",
            body_text: "From solar energy to smart security—STIL delivers sustainable solutions across Abuja (FCT) and surrounding FCT areas.",
            image_url: null,
            ctas: [
              { label: "Call Now", href: "tel:+2348064398669", variant: "primary" },
            ],
          } as HeroContent;
        }
        throw error;
      }

      // Parse CTAs from JSON - cast through unknown for type safety
      const ctasRaw = data.ctas_json;
      const ctas: CTAButton[] = Array.isArray(ctasRaw) 
        ? (ctasRaw as unknown as CTAButton[]).filter(
            (c): c is CTAButton => 
              typeof c === 'object' && c !== null && 'label' in c && 'href' in c
          )
        : [];

      return {
        id: data.id,
        title: data.title,
        subtitle: data.subtitle,
        body_text: data.body_text,
        image_url: (data as any).media_assets?.public_url || null,
        ctas,
      } as HeroContent;
    },
  });
}
