import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Stat {
  id: string;
  icon: string;
  value: number;
  suffix: string;
  label: string;
  subtext: string | null;
  sort_order: number;
  published: boolean;
}

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stats")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;

      return (data || []) as Stat[];
    },
  });
}
