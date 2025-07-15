export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      action_logs: {
        Row: {
          action_type: string
          details: Json | null
          id: string
          target_id: string | null
          target_type: string | null
          timestamp: string | null
          triggered_by: string | null
        }
        Insert: {
          action_type: string
          details?: Json | null
          id?: string
          target_id?: string | null
          target_type?: string | null
          timestamp?: string | null
          triggered_by?: string | null
        }
        Update: {
          action_type?: string
          details?: Json | null
          id?: string
          target_id?: string | null
          target_type?: string | null
          timestamp?: string | null
          triggered_by?: string | null
        }
        Relationships: []
      }
      ask_specter_logs: {
        Row: {
          ai_response: string | null
          context: Json | null
          id: string
          prompt: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          ai_response?: string | null
          context?: Json | null
          id?: string
          prompt: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          ai_response?: string | null
          context?: Json | null
          id?: string
          prompt?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      campaign_posts: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          id: string
          platform: string | null
          post_content: string
          scheduled_time: string | null
          status: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          platform?: string | null
          post_content: string
          scheduled_time?: string | null
          status?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          platform?: string | null
          post_content?: string
          scheduled_time?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_posts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          actions: Json | null
          created_at: string | null
          created_by: string | null
          id: string
          objective: string | null
          scheduled_date: string | null
          status: string | null
          target_company: string
          type: string
          updated_at: string | null
        }
        Insert: {
          actions?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          objective?: string | null
          scheduled_date?: string | null
          status?: string | null
          target_company: string
          type: string
          updated_at?: string | null
        }
        Update: {
          actions?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          objective?: string | null
          scheduled_date?: string | null
          status?: string | null
          target_company?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      competitor_profiles: {
        Row: {
          ad_activity: Json | null
          company_name: string
          created_at: string | null
          created_by: string | null
          customer_complaints: Json | null
          estimated_ad_spend: number | null
          id: string
          sentiment_score: number | null
          seo_score: number | null
          social_sentiment: Json | null
          top_keywords: string[] | null
          updated_at: string | null
          vulnerabilities: string[] | null
          website: string | null
        }
        Insert: {
          ad_activity?: Json | null
          company_name: string
          created_at?: string | null
          created_by?: string | null
          customer_complaints?: Json | null
          estimated_ad_spend?: number | null
          id?: string
          sentiment_score?: number | null
          seo_score?: number | null
          social_sentiment?: Json | null
          top_keywords?: string[] | null
          updated_at?: string | null
          vulnerabilities?: string[] | null
          website?: string | null
        }
        Update: {
          ad_activity?: Json | null
          company_name?: string
          created_at?: string | null
          created_by?: string | null
          customer_complaints?: Json | null
          estimated_ad_spend?: number | null
          id?: string
          sentiment_score?: number | null
          seo_score?: number | null
          social_sentiment?: Json | null
          top_keywords?: string[] | null
          updated_at?: string | null
          vulnerabilities?: string[] | null
          website?: string | null
        }
        Relationships: []
      }
      competitors: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          name: string
          website: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          website?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          website?: string | null
        }
        Relationships: []
      }
      data_sources: {
        Row: {
          competitor_id: string | null
          fetched_at: string | null
          id: string
          source_type: string | null
          url: string | null
        }
        Insert: {
          competitor_id?: string | null
          fetched_at?: string | null
          id?: string
          source_type?: string | null
          url?: string | null
        }
        Update: {
          competitor_id?: string | null
          fetched_at?: string | null
          id?: string
          source_type?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_sources_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_campaigns: {
        Row: {
          client_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          scheduled_end: string | null
          scheduled_start: string | null
          status: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          scheduled_end?: string | null
          scheduled_start?: string | null
          status?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          scheduled_end?: string | null
          scheduled_start?: string | null
          status?: string | null
        }
        Relationships: []
      }
      personas: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          platform: string | null
          scripts: Json | null
          voice_tone: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          platform?: string | null
          scripts?: Json | null
          voice_tone?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          platform?: string | null
          scripts?: Json | null
          voice_tone?: string | null
        }
        Relationships: []
      }
      sentiment_analysis: {
        Row: {
          analyzed_at: string | null
          data_source_id: string | null
          id: string
          key_topics: string[] | null
          sentiment_score: number | null
        }
        Insert: {
          analyzed_at?: string | null
          data_source_id?: string | null
          id?: string
          key_topics?: string[] | null
          sentiment_score?: number | null
        }
        Update: {
          analyzed_at?: string | null
          data_source_id?: string | null
          id?: string
          key_topics?: string[] | null
          sentiment_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sentiment_analysis_data_source_id_fkey"
            columns: ["data_source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          aggressive_mode: boolean | null
          created_at: string | null
          id: string
          integrations: Json | null
          notifications: Json | null
          stealth_mode: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          aggressive_mode?: boolean | null
          created_at?: string | null
          id?: string
          integrations?: Json | null
          notifications?: Json | null
          stealth_mode?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          aggressive_mode?: boolean | null
          created_at?: string | null
          id?: string
          integrations?: Json | null
          notifications?: Json | null
          stealth_mode?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          role: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          role?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          role?: string | null
          status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
