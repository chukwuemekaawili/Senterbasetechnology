import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image_url: string | null;
  image_asset_id: string | null;
  sort_order: number;
  published: boolean;
}

export function useTeamMembers() {
  return useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select(`
          id,
          name,
          role,
          sort_order,
          published,
          image_asset_id,
          media_assets!team_members_image_asset_id_fkey (
            public_url
          )
        `)
        .order("sort_order", { ascending: true });

      if (error) throw error;

      return (data || []).map((member: any) => ({
        id: member.id,
        name: member.name,
        role: member.role,
        sort_order: member.sort_order,
        published: member.published,
        image_asset_id: member.image_asset_id,
        image_url: member.media_assets?.public_url || null,
      })) as TeamMember[];
    },
  });
}
