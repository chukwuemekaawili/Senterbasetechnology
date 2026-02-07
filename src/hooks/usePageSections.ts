import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CTAButton {
  label: string;
  href: string;
  variant: "primary" | "secondary" | "outline" | "ghost";
}

export interface PageSection {
  id: string;
  page_slug: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  body_text: string | null;
  body_json: any;
  image_url: string | null;
  ctas: CTAButton[];
  published: boolean;
}

export function usePageSections(pageSlug: string) {
  return useQuery({
    queryKey: ["page-sections", pageSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_sections")
        .select(`
          id,
          page_slug,
          section_key,
          title,
          subtitle,
          body_text,
          body_json,
          ctas_json,
          image_asset_id,
          published,
          media_assets!page_sections_image_asset_id_fkey (
            public_url
          )
        `)
        .eq("page_slug", pageSlug)
        .order("sort_order", { ascending: true });

      if (error) throw error;

      return (data || []).map((section: any) => {
        const ctasRaw = section.ctas_json;
        const ctas: CTAButton[] = Array.isArray(ctasRaw)
          ? (ctasRaw as unknown as CTAButton[]).filter(
              (c): c is CTAButton =>
                typeof c === 'object' && c !== null && 'label' in c && 'href' in c
            )
          : [];
        return {
          id: section.id,
          page_slug: section.page_slug,
          section_key: section.section_key,
          title: section.title,
          subtitle: section.subtitle,
          body_text: section.body_text,
          body_json: section.body_json,
          image_url: section.media_assets?.public_url || null,
          ctas,
          published: section.published,
        };
      }) as PageSection[];
    },
  });
}

export function usePageSection(pageSlug: string, sectionKey: string) {
  return useQuery({
    queryKey: ["page-section", pageSlug, sectionKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_sections")
        .select(`
          id,
          page_slug,
          section_key,
          title,
          subtitle,
          body_text,
          body_json,
          ctas_json,
          image_asset_id,
          published,
          media_assets!page_sections_image_asset_id_fkey (
            public_url
          )
        `)
        .eq("page_slug", pageSlug)
        .eq("section_key", sectionKey)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
      }

      const ctasRaw = data.ctas_json;
      const ctas: CTAButton[] = Array.isArray(ctasRaw)
        ? (ctasRaw as unknown as CTAButton[]).filter(
            (c): c is CTAButton =>
              typeof c === 'object' && c !== null && 'label' in c && 'href' in c
          )
        : [];
      return {
        id: data.id,
        page_slug: data.page_slug,
        section_key: data.section_key,
        title: data.title,
        subtitle: data.subtitle,
        body_text: data.body_text,
        body_json: data.body_json,
        image_url: (data as any).media_assets?.public_url || null,
        ctas,
        published: data.published,
      } as PageSection;
    },
  });
}
