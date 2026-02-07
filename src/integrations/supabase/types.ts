export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_audit: {
        Row: {
          action: string
          admin_user_id: string | null
          after_summary: Json | null
          before_summary: Json | null
          created_at: string
          entity_id: string | null
          entity_name: string | null
          entity_type: string
          id: string
          ip_address: string | null
        }
        Insert: {
          action: string
          admin_user_id?: string | null
          after_summary?: Json | null
          before_summary?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_name?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string | null
          after_summary?: Json | null
          before_summary?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          alt: string | null
          category: string
          created_at: string
          featured: boolean | null
          id: string
          image_asset_id: string
          published: boolean | null
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          alt?: string | null
          category: string
          created_at?: string
          featured?: boolean | null
          id?: string
          image_asset_id: string
          published?: boolean | null
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          alt?: string | null
          category?: string
          created_at?: string
          featured?: boolean | null
          id?: string
          image_asset_id?: string
          published?: boolean | null
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_items_image_asset_id_fkey"
            columns: ["image_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          admin_note: string | null
          created_at: string
          email: string | null
          id: string
          location: string
          message: string
          name: string
          phone: string
          preferred_contact_time: string | null
          service: string
          source_page: string
          status: string
          updated_at: string | null
        }
        Insert: {
          admin_note?: string | null
          created_at?: string
          email?: string | null
          id?: string
          location: string
          message: string
          name: string
          phone: string
          preferred_contact_time?: string | null
          service: string
          source_page: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          admin_note?: string | null
          created_at?: string
          email?: string | null
          id?: string
          location?: string
          message?: string
          name?: string
          phone?: string
          preferred_contact_time?: string | null
          service?: string
          source_page?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          alt: string | null
          bytes: number | null
          category: string | null
          created_at: string
          height: number | null
          id: string
          is_stock: boolean | null
          public_url: string
          source: string | null
          storage_path: string
          tags: string[] | null
          title: string
          updated_at: string
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          alt?: string | null
          bytes?: number | null
          category?: string | null
          created_at?: string
          height?: number | null
          id?: string
          is_stock?: boolean | null
          public_url: string
          source?: string | null
          storage_path: string
          tags?: string[] | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          alt?: string | null
          bytes?: number | null
          category?: string | null
          created_at?: string
          height?: number | null
          id?: string
          is_stock?: boolean | null
          public_url?: string
          source?: string | null
          storage_path?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: []
      }
      page_sections: {
        Row: {
          body_json: Json | null
          body_text: string | null
          created_at: string
          ctas_json: Json | null
          id: string
          image_asset_id: string | null
          page_slug: string
          published: boolean | null
          section_key: string
          sort_order: number | null
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          body_json?: Json | null
          body_text?: string | null
          created_at?: string
          ctas_json?: Json | null
          id?: string
          image_asset_id?: string | null
          page_slug: string
          published?: boolean | null
          section_key: string
          sort_order?: number | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          body_json?: Json | null
          body_text?: string | null
          created_at?: string
          ctas_json?: Json | null
          id?: string
          image_asset_id?: string | null
          page_slug?: string
          published?: boolean | null
          section_key?: string
          sort_order?: number | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_sections_image_asset_id_fkey"
            columns: ["image_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          benefits: string[] | null
          category: string
          created_at: string
          faqs: Json | null
          hero_description: string
          id: string
          image_asset_id: string | null
          published: boolean | null
          related_slugs: string[] | null
          short_description: string
          slug: string
          sort_order: number | null
          title: string
          updated_at: string
          what_we_do: string[] | null
        }
        Insert: {
          benefits?: string[] | null
          category: string
          created_at?: string
          faqs?: Json | null
          hero_description: string
          id?: string
          image_asset_id?: string | null
          published?: boolean | null
          related_slugs?: string[] | null
          short_description: string
          slug: string
          sort_order?: number | null
          title: string
          updated_at?: string
          what_we_do?: string[] | null
        }
        Update: {
          benefits?: string[] | null
          category?: string
          created_at?: string
          faqs?: Json | null
          hero_description?: string
          id?: string
          image_asset_id?: string | null
          published?: boolean | null
          related_slugs?: string[] | null
          short_description?: string
          slug?: string
          sort_order?: number | null
          title?: string
          updated_at?: string
          what_we_do?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "services_image_asset_id_fkey"
            columns: ["image_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          address: string
          coverage_statement: string
          created_at: string
          email: string
          hero_image_url: string | null
          id: string
          legal_last_updated: string | null
          logo_dark_url: string | null
          logo_url: string | null
          meta_description: string | null
          og_image_url: string | null
          phone: string
          primary_cta_label: string
          site_title: string
          social_facebook: string | null
          social_instagram: string | null
          social_twitter: string | null
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          address?: string
          coverage_statement?: string
          created_at?: string
          email?: string
          hero_image_url?: string | null
          id?: string
          legal_last_updated?: string | null
          logo_dark_url?: string | null
          logo_url?: string | null
          meta_description?: string | null
          og_image_url?: string | null
          phone?: string
          primary_cta_label?: string
          site_title?: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          address?: string
          coverage_statement?: string
          created_at?: string
          email?: string
          hero_image_url?: string | null
          id?: string
          legal_last_updated?: string | null
          logo_dark_url?: string | null
          logo_url?: string | null
          meta_description?: string | null
          og_image_url?: string | null
          phone?: string
          primary_cta_label?: string
          site_title?: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      stats: {
        Row: {
          created_at: string
          icon: string
          id: string
          label: string
          published: boolean | null
          sort_order: number | null
          subtext: string | null
          suffix: string
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          icon?: string
          id?: string
          label: string
          published?: boolean | null
          sort_order?: number | null
          subtext?: string | null
          suffix?: string
          updated_at?: string
          value: number
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          label?: string
          published?: boolean | null
          sort_order?: number | null
          subtext?: string | null
          suffix?: string
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          id: string
          image_asset_id: string | null
          name: string
          published: boolean | null
          role: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_asset_id?: string | null
          name: string
          published?: boolean | null
          role: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_asset_id?: string | null
          name?: string
          published?: boolean | null
          role?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_image_asset_id_fkey"
            columns: ["image_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          content: string
          created_at: string
          id: string
          initials: string
          name: string
          published: boolean | null
          rating: number
          role: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          initials: string
          name: string
          published?: boolean | null
          rating?: number
          role: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          initials?: string
          name?: string
          published?: boolean | null
          rating?: number
          role?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_admin_role: {
        Args: {
          _role: Database["public"]["Enums"]["admin_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      admin_role: "super_admin" | "admin" | "editor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admin_role: ["super_admin", "admin", "editor"],
    },
  },
} as const
