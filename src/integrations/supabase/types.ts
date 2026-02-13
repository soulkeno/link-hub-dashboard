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
      profiles: {
        Row: {
          accent_color: string | null
          avatar_url: string | null
          background_url: string | null
          bg_color: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          glow_badges: boolean | null
          glow_socials: boolean | null
          glow_username: boolean | null
          id: string
          location: string | null
          music_url: string | null
          text_color: string | null
          updated_at: string
          user_id: string
          username: string
          view_count: number | null
        }
        Insert: {
          accent_color?: string | null
          avatar_url?: string | null
          background_url?: string | null
          bg_color?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          glow_badges?: boolean | null
          glow_socials?: boolean | null
          glow_username?: boolean | null
          id?: string
          location?: string | null
          music_url?: string | null
          text_color?: string | null
          updated_at?: string
          user_id: string
          username: string
          view_count?: number | null
        }
        Update: {
          accent_color?: string | null
          avatar_url?: string | null
          background_url?: string | null
          bg_color?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          glow_badges?: boolean | null
          glow_socials?: boolean | null
          glow_username?: boolean | null
          id?: string
          location?: string | null
          music_url?: string | null
          text_color?: string | null
          updated_at?: string
          user_id?: string
          username?: string
          view_count?: number | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          download_count: number | null
          file_url: string | null
          icon_url: string | null
          id: string
          like_count: number | null
          minecraft_versions: string[] | null
          status: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          download_count?: number | null
          file_url?: string | null
          icon_url?: string | null
          id?: string
          like_count?: number | null
          minecraft_versions?: string[] | null
          status?: string
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          download_count?: number | null
          file_url?: string | null
          icon_url?: string | null
          id?: string
          like_count?: number | null
          minecraft_versions?: string[] | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          id: string
          label: string | null
          platform: string
          sort_order: number | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string | null
          platform: string
          sort_order?: number | null
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
          platform?: string
          sort_order?: number | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_icon_url: string | null
          badge_name: string
          created_at: string
          id: string
          is_custom: boolean | null
          sort_order: number | null
          user_id: string
        }
        Insert: {
          badge_icon_url?: string | null
          badge_name: string
          created_at?: string
          id?: string
          is_custom?: boolean | null
          sort_order?: number | null
          user_id: string
        }
        Update: {
          badge_icon_url?: string | null
          badge_name?: string
          created_at?: string
          id?: string
          is_custom?: boolean | null
          sort_order?: number | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_download_count: {
        Args: { project_id: string }
        Returns: undefined
      }
      increment_view_count: {
        Args: { profile_username: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
