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
      analytics_events: {
        Row: {
          created_at: string
          event_data: Json
          event_type: string
          id: string
          ip_address: unknown | null
          session_id: string | null
          source: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json
          event_type: string
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          source?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json
          event_type?: string
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          source?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          contact_id: string | null
          created_at: string
          description: string | null
          end_time: string
          id: string
          location: string | null
          meeting_link: string | null
          start_time: string
          status: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          description?: string | null
          end_time: string
          id?: string
          location?: string | null
          meeting_link?: string | null
          start_time: string
          status?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          description?: string | null
          end_time?: string
          id?: string
          location?: string | null
          meeting_link?: string | null
          start_time?: string
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
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
          is_deleted: boolean | null
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
          is_deleted?: boolean | null
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
          is_deleted?: boolean | null
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
          is_deleted: boolean | null
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
          is_deleted?: boolean | null
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
          is_deleted?: boolean | null
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
      competitor_tracking: {
        Row: {
          backlinks: number | null
          company_name: string
          created_at: string
          created_by: string | null
          domain: string
          id: string
          keywords: number | null
          market_share: number | null
          organic_traffic: number | null
          paid_traffic: number | null
          seo_score: number | null
          updated_at: string
        }
        Insert: {
          backlinks?: number | null
          company_name: string
          created_at?: string
          created_by?: string | null
          domain: string
          id?: string
          keywords?: number | null
          market_share?: number | null
          organic_traffic?: number | null
          paid_traffic?: number | null
          seo_score?: number | null
          updated_at?: string
        }
        Update: {
          backlinks?: number | null
          company_name?: string
          created_at?: string
          created_by?: string | null
          domain?: string
          id?: string
          keywords?: number | null
          market_share?: number | null
          organic_traffic?: number | null
          paid_traffic?: number | null
          seo_score?: number | null
          updated_at?: string
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
      contacts: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          job_title: string | null
          last_contacted_at: string | null
          last_name: string | null
          lead_score: number | null
          lead_source: string | null
          lead_status: string | null
          notes: string | null
          phone: string | null
          tags: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          job_title?: string | null
          last_contacted_at?: string | null
          last_name?: string | null
          lead_score?: number | null
          lead_source?: string | null
          lead_status?: string | null
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          job_title?: string | null
          last_contacted_at?: string | null
          last_name?: string | null
          lead_score?: number | null
          lead_source?: string | null
          lead_status?: string | null
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
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
      deals: {
        Row: {
          actual_close_date: string | null
          contact_id: string | null
          created_at: string
          description: string | null
          expected_close_date: string | null
          id: string
          pipeline_id: string | null
          probability: number | null
          stage: string
          status: string | null
          title: string
          updated_at: string
          user_id: string | null
          value: number | null
        }
        Insert: {
          actual_close_date?: string | null
          contact_id?: string | null
          created_at?: string
          description?: string | null
          expected_close_date?: string | null
          id?: string
          pipeline_id?: string | null
          probability?: number | null
          stage: string
          status?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
          value?: number | null
        }
        Update: {
          actual_close_date?: string | null
          contact_id?: string | null
          created_at?: string
          description?: string | null
          expected_close_date?: string | null
          id?: string
          pipeline_id?: string | null
          probability?: number | null
          stage?: string
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "pipelines"
            referencedColumns: ["id"]
          },
        ]
      }
      disruption_operations: {
        Row: {
          created_at: string
          description: string | null
          estimated_duration: string | null
          id: string
          is_deleted: boolean | null
          name: string
          priority: string
          scheduled_date: string
          status: string
          target: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          estimated_duration?: string | null
          id?: string
          is_deleted?: boolean | null
          name: string
          priority: string
          scheduled_date: string
          status?: string
          target: string
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          estimated_duration?: string | null
          id?: string
          is_deleted?: boolean | null
          name?: string
          priority?: string
          scheduled_date?: string
          status?: string
          target?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      email_campaigns: {
        Row: {
          clicked_count: number | null
          content: string
          created_at: string
          id: string
          name: string
          opened_count: number | null
          recipient_count: number | null
          scheduled_at: string | null
          sent_at: string | null
          sent_count: number | null
          status: string | null
          subject: string
          template_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          clicked_count?: number | null
          content: string
          created_at?: string
          id?: string
          name: string
          opened_count?: number | null
          recipient_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          sent_count?: number | null
          status?: string | null
          subject: string
          template_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          clicked_count?: number | null
          content?: string
          created_at?: string
          id?: string
          name?: string
          opened_count?: number | null
          recipient_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          sent_count?: number | null
          status?: string | null
          subject?: string
          template_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          subject: string
          template_type: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          template_type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          template_type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      form_submissions: {
        Row: {
          contact_id: string | null
          created_at: string
          data: Json
          form_id: string | null
          id: string
          ip_address: unknown | null
          source_url: string | null
          user_agent: string | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          data?: Json
          form_id?: string | null
          id?: string
          ip_address?: unknown | null
          source_url?: string | null
          user_agent?: string | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          data?: Json
          form_id?: string | null
          id?: string
          ip_address?: unknown | null
          source_url?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      forms: {
        Row: {
          created_at: string
          fields: Json
          id: string
          is_active: boolean | null
          landing_page_id: string | null
          name: string
          submissions: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          fields?: Json
          id?: string
          is_active?: boolean | null
          landing_page_id?: string | null
          name: string
          submissions?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          fields?: Json
          id?: string
          is_active?: boolean | null
          landing_page_id?: string | null
          name?: string
          submissions?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forms_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      intelligence_feeds: {
        Row: {
          competitor: string | null
          created_at: string
          data: Json | null
          description: string | null
          id: string
          impact: string
          is_trending: boolean | null
          priority: string
          source: string
          title: string
          tracking_enabled: boolean | null
          type: string
          updated_at: string
          url: string | null
        }
        Insert: {
          competitor?: string | null
          created_at?: string
          data?: Json | null
          description?: string | null
          id?: string
          impact: string
          is_trending?: boolean | null
          priority: string
          source: string
          title: string
          tracking_enabled?: boolean | null
          type: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          competitor?: string | null
          created_at?: string
          data?: Json | null
          description?: string | null
          id?: string
          impact?: string
          is_trending?: boolean | null
          priority?: string
          source?: string
          title?: string
          tracking_enabled?: boolean | null
          type?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      landing_pages: {
        Row: {
          content: Json
          conversions: number | null
          created_at: string
          id: string
          is_published: boolean | null
          name: string
          slug: string
          title: string | null
          updated_at: string
          user_id: string | null
          views: number | null
        }
        Insert: {
          content?: Json
          conversions?: number | null
          created_at?: string
          id?: string
          is_published?: boolean | null
          name: string
          slug: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
          views?: number | null
        }
        Update: {
          content?: Json
          conversions?: number | null
          created_at?: string
          id?: string
          is_published?: boolean | null
          name?: string
          slug?: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
          views?: number | null
        }
        Relationships: []
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
      operation_history: {
        Row: {
          created_at: string
          description: string | null
          id: string
          metrics: Json | null
          operation_type: string
          result: string | null
          target: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          metrics?: Json | null
          operation_type: string
          result?: string | null
          target?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          metrics?: Json | null
          operation_type?: string
          result?: string | null
          target?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      personas: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_deleted: boolean | null
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
          is_deleted?: boolean | null
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
          is_deleted?: boolean | null
          name?: string
          platform?: string | null
          scripts?: Json | null
          voice_tone?: string | null
        }
        Relationships: []
      }
      pipelines: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          stages: Json
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          stages?: Json
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          stages?: Json
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      scheduled_posts: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          engagement_metrics: Json | null
          id: string
          media_urls: string[] | null
          platform: string
          post_id: string | null
          scheduled_time: string
          status: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          engagement_metrics?: Json | null
          id?: string
          media_urls?: string[] | null
          platform: string
          post_id?: string | null
          scheduled_time: string
          status?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          engagement_metrics?: Json | null
          id?: string
          media_urls?: string[] | null
          platform?: string
          post_id?: string | null
          scheduled_time?: string
          status?: string
          updated_at?: string
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
      seo_keywords: {
        Row: {
          created_at: string
          difficulty: number | null
          domain: string
          id: string
          keyword: string
          previous_rank: number | null
          rank: number | null
          rank_change: number | null
          search_volume: number | null
          traffic_estimate: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          difficulty?: number | null
          domain: string
          id?: string
          keyword: string
          previous_rank?: number | null
          rank?: number | null
          rank_change?: number | null
          search_volume?: number | null
          traffic_estimate?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          difficulty?: number | null
          domain?: string
          id?: string
          keyword?: string
          previous_rank?: number | null
          rank?: number | null
          rank_change?: number | null
          search_volume?: number | null
          traffic_estimate?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      social_posts: {
        Row: {
          content: string
          created_at: string
          engagement_metrics: Json | null
          id: string
          media_urls: string[] | null
          platform: string
          published_at: string | null
          scheduled_at: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          engagement_metrics?: Json | null
          id?: string
          media_urls?: string[] | null
          platform: string
          published_at?: string | null
          scheduled_at?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          engagement_metrics?: Json | null
          id?: string
          media_urls?: string[] | null
          platform?: string
          published_at?: string | null
          scheduled_at?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          completed_at: string | null
          contact_id: string | null
          created_at: string
          deal_id: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
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
      workflows: {
        Row: {
          actions: Json
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          runs_count: number | null
          trigger_config: Json
          trigger_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          actions?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          runs_count?: number | null
          trigger_config?: Json
          trigger_type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          actions?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          runs_count?: number | null
          trigger_config?: Json
          trigger_type?: string
          updated_at?: string
          user_id?: string | null
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
