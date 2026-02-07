import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { services as staticServices, Service as StaticService } from "@/data/services";
import type { Json } from "@/integrations/supabase/types";

// Convert DB service to the format used by components
export interface ServiceWithIcon extends StaticService {
  id?: string;
  imageUrl?: string;
}

// Type for FAQ from DB
interface FAQItem {
  question: string;
  answer: string;
}

// Parse FAQs from JSON type
const parseFaqs = (faqs: Json | null): FAQItem[] => {
  if (!faqs || !Array.isArray(faqs)) return [];
  return faqs.filter((faq): faq is { question: string; answer: string } => 
    typeof faq === 'object' && 
    faq !== null && 
    'question' in faq && 
    'answer' in faq
  );
};

// Map DB service to component format (includes icon from static data)
const mapDBServiceToComponent = (dbService: {
  id: string;
  slug: string;
  title: string;
  category: string;
  short_description: string;
  hero_description: string;
  what_we_do: string[] | null;
  benefits: string[] | null;
  faqs: Json | null;
  related_slugs: string[] | null;
  image_asset_id: string | null;
  published: boolean | null;
  sort_order: number | null;
}): ServiceWithIcon => {
  const staticService = staticServices.find(s => s.slug === dbService.slug);
  
  return {
    slug: dbService.slug,
    title: dbService.title,
    shortDescription: dbService.short_description,
    icon: staticService?.icon || staticServices[0].icon, // Fallback to first icon
    category: dbService.category,
    heroDescription: dbService.hero_description,
    whatWeDo: dbService.what_we_do || [],
    benefits: dbService.benefits || [],
    faqs: parseFaqs(dbService.faqs),
    relatedSlugs: dbService.related_slugs || [],
    id: dbService.id,
  };
};

// Fetch all published services
export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching services:", error);
        // Return static services as fallback
        return staticServices;
      }

      if (!data || data.length === 0) {
        // Return static services if DB is empty
        return staticServices;
      }

      return data.map(mapDBServiceToComponent);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
  });
};

// Fetch a single service by slug
export const useServiceBySlug = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["service", slug],
    queryFn: async () => {
      if (!slug) return null;

      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (error) {
        console.error("Error fetching service:", error);
        // Fallback to static data
        const staticService = staticServices.find(s => s.slug === slug);
        return staticService || null;
      }

      if (!data) {
        // Fallback to static data if not in DB
        const staticService = staticServices.find(s => s.slug === slug);
        return staticService || null;
      }

      return mapDBServiceToComponent(data);
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

// Get related services by slugs (from DB first, then static)
export const useRelatedServices = (slugs: string[]) => {
  return useQuery({
    queryKey: ["relatedServices", slugs],
    queryFn: async () => {
      if (!slugs || slugs.length === 0) return [];

      const { data, error } = await supabase
        .from("services")
        .select("*")
        .in("slug", slugs)
        .eq("published", true);

      if (error || !data || data.length === 0) {
        // Fallback to static data
        return staticServices.filter(s => slugs.includes(s.slug));
      }

      return data.map(mapDBServiceToComponent);
    },
    enabled: slugs.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
