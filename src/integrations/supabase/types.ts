export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agent_talent_relationships: {
        Row: {
          agent_id: string | null
          created_at: string | null
          id: string
          talent_id: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          id?: string
          talent_id?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          id?: string
          talent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_talent_relationships_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_talent_relationships_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_talent_relationships_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_talent_relationships_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      casting_dates: {
        Row: {
          casting_id: string | null
          created_at: string | null
          end_date: string
          id: string
          remarks: string | null
          start_date: string
        }
        Insert: {
          casting_id?: string | null
          created_at?: string | null
          end_date: string
          id?: string
          remarks?: string | null
          start_date: string
        }
        Update: {
          casting_id?: string | null
          created_at?: string | null
          end_date?: string
          id?: string
          remarks?: string | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "casting_dates_casting_id_fkey"
            columns: ["casting_id"]
            isOneToOne: false
            referencedRelation: "castings"
            referencedColumns: ["id"]
          },
        ]
      }
      casting_form_fields: {
        Row: {
          casting_id: string | null
          created_at: string | null
          field_type: string
          guest_access: boolean | null
          id: string
          label: string
          position: number | null
          required: boolean | null
          sign_up: boolean | null
          updated_at: string | null
        }
        Insert: {
          casting_id?: string | null
          created_at?: string | null
          field_type: string
          guest_access?: boolean | null
          id?: string
          label: string
          position?: number | null
          required?: boolean | null
          sign_up?: boolean | null
          updated_at?: string | null
        }
        Update: {
          casting_id?: string | null
          created_at?: string | null
          field_type?: string
          guest_access?: boolean | null
          id?: string
          label?: string
          position?: number | null
          required?: boolean | null
          sign_up?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "casting_form_fields_casting_id_fkey"
            columns: ["casting_id"]
            isOneToOne: false
            referencedRelation: "castings"
            referencedColumns: ["id"]
          },
        ]
      }
      casting_guests: {
        Row: {
          access_token: string
          casting_id: string | null
          created_at: string | null
          email: string
          id: string
          is_enabled: boolean | null
          last_login: string | null
          name: string
        }
        Insert: {
          access_token: string
          casting_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_enabled?: boolean | null
          last_login?: string | null
          name: string
        }
        Update: {
          access_token?: string
          casting_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_enabled?: boolean | null
          last_login?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "casting_guests_casting_id_fkey"
            columns: ["casting_id"]
            isOneToOne: false
            referencedRelation: "castings"
            referencedColumns: ["id"]
          },
        ]
      }
      casting_talents: {
        Row: {
          availability_status: string | null
          casting_id: string | null
          created_at: string | null
          final_fee: number | null
          id: string
          remarks: string | null
          round: number | null
          talent_fee: number | null
          talent_id: string | null
          updated_at: string | null
        }
        Insert: {
          availability_status?: string | null
          casting_id?: string | null
          created_at?: string | null
          final_fee?: number | null
          id?: string
          remarks?: string | null
          round?: number | null
          talent_fee?: number | null
          talent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          availability_status?: string | null
          casting_id?: string | null
          created_at?: string | null
          final_fee?: number | null
          id?: string
          remarks?: string | null
          round?: number | null
          talent_fee?: number | null
          talent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "casting_talents_casting_id_fkey"
            columns: ["casting_id"]
            isOneToOne: false
            referencedRelation: "castings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "casting_talents_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      castings: {
        Row: {
          allow_talent_portal: boolean | null
          allow_talent_portal_apply: boolean | null
          briefing: string | null
          casting_type: string | null
          client_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          logo_url: string | null
          name: string
          project_manager_id: string | null
          scout_id: string | null
          show_briefing: boolean | null
          show_briefing_on_signup: boolean | null
          signup_banner_url: string | null
          signup_fields: Json | null
          status: Database["public"]["Enums"]["casting_status"] | null
          type: Database["public"]["Enums"]["casting_type"]
          updated_at: string | null
        }
        Insert: {
          allow_talent_portal?: boolean | null
          allow_talent_portal_apply?: boolean | null
          briefing?: string | null
          casting_type?: string | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          project_manager_id?: string | null
          scout_id?: string | null
          show_briefing?: boolean | null
          show_briefing_on_signup?: boolean | null
          signup_banner_url?: string | null
          signup_fields?: Json | null
          status?: Database["public"]["Enums"]["casting_status"] | null
          type: Database["public"]["Enums"]["casting_type"]
          updated_at?: string | null
        }
        Update: {
          allow_talent_portal?: boolean | null
          allow_talent_portal_apply?: boolean | null
          briefing?: string | null
          casting_type?: string | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          project_manager_id?: string | null
          scout_id?: string | null
          show_briefing?: boolean | null
          show_briefing_on_signup?: boolean | null
          signup_banner_url?: string | null
          signup_fields?: Json | null
          status?: Database["public"]["Enums"]["casting_status"] | null
          type?: Database["public"]["Enums"]["casting_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "castings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "castings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "castings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "castings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "castings_project_manager_id_fkey"
            columns: ["project_manager_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "castings_project_manager_id_fkey"
            columns: ["project_manager_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "castings_scout_id_fkey"
            columns: ["scout_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "castings_scout_id_fkey"
            columns: ["scout_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          logo_url: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          logo_url?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          logo_url?: string | null
          name?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          subject: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          subject: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_selections: {
        Row: {
          casting_id: string | null
          comments: string | null
          created_at: string | null
          guest_id: string | null
          id: string
          preference_order: number | null
          talent_id: string | null
          updated_at: string | null
        }
        Insert: {
          casting_id?: string | null
          comments?: string | null
          created_at?: string | null
          guest_id?: string | null
          id?: string
          preference_order?: number | null
          talent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          casting_id?: string | null
          comments?: string | null
          created_at?: string | null
          guest_id?: string | null
          id?: string
          preference_order?: number | null
          talent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guest_selections_casting_id_fkey"
            columns: ["casting_id"]
            isOneToOne: false
            referencedRelation: "castings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_selections_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "casting_guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_selections_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_videos: {
        Row: {
          client_approval_status: string | null
          concept: string | null
          created_at: string | null
          editing_status: string | null
          footage_eta: string | null
          footage_link: string | null
          footage_qa_status: string | null
          id: string
          language: string | null
          project_id: string | null
          region: string | null
          review_status: string | null
          script_status: string | null
          status: string | null
          talent_id: string | null
          title: string | null
          translation_status: string | null
          type: string | null
          updated_at: string | null
          video_number: string | null
        }
        Insert: {
          client_approval_status?: string | null
          concept?: string | null
          created_at?: string | null
          editing_status?: string | null
          footage_eta?: string | null
          footage_link?: string | null
          footage_qa_status?: string | null
          id?: string
          language?: string | null
          project_id?: string | null
          region?: string | null
          review_status?: string | null
          script_status?: string | null
          status?: string | null
          talent_id?: string | null
          title?: string | null
          translation_status?: string | null
          type?: string | null
          updated_at?: string | null
          video_number?: string | null
        }
        Update: {
          client_approval_status?: string | null
          concept?: string | null
          created_at?: string | null
          editing_status?: string | null
          footage_eta?: string | null
          footage_link?: string | null
          footage_qa_status?: string | null
          id?: string
          language?: string | null
          project_id?: string | null
          region?: string | null
          review_status?: string | null
          script_status?: string | null
          status?: string | null
          talent_id?: string | null
          title?: string | null
          translation_status?: string | null
          type?: string | null
          updated_at?: string | null
          video_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_videos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_videos_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_id: string | null
          created_at: string | null
          end_date: string | null
          id: string
          name: string
          project_manager_id: string | null
          start_date: string | null
          status: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          name: string
          project_manager_id?: string | null
          start_date?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          name?: string
          project_manager_id?: string | null
          start_date?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_project_manager_id_fkey"
            columns: ["project_manager_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_project_manager_id_fkey"
            columns: ["project_manager_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_calendar: {
        Row: {
          casting_id: string | null
          created_at: string | null
          date: string
          description: string
          id: string
          talent_id: string | null
          updated_at: string | null
        }
        Insert: {
          casting_id?: string | null
          created_at?: string | null
          date: string
          description: string
          id?: string
          talent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          casting_id?: string | null
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          talent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "talent_calendar_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talent_calendar_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_files: {
        Row: {
          category: string
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          talent_id: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          talent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          talent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "talent_files_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talent_files_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_jobs: {
        Row: {
          company: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          job_title: string
          start_date: string | null
          talent_id: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          job_title: string
          start_date?: string | null
          talent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          job_title?: string
          start_date?: string | null
          talent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "talent_jobs_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talent_jobs_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_media: {
        Row: {
          category: Database["public"]["Enums"]["media_category"] | null
          created_at: string | null
          description: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          folder: string | null
          id: string
          is_profile: boolean | null
          is_shared: boolean | null
          mime_type: string | null
          position: number | null
          tags: string[] | null
          talent_id: string | null
          updated_at: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["media_category"] | null
          created_at?: string | null
          description?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          folder?: string | null
          id?: string
          is_profile?: boolean | null
          is_shared?: boolean | null
          mime_type?: string | null
          position?: number | null
          tags?: string[] | null
          talent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["media_category"] | null
          created_at?: string | null
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          folder?: string | null
          id?: string
          is_profile?: boolean | null
          is_shared?: boolean | null
          mime_type?: string | null
          position?: number | null
          tags?: string[] | null
          talent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "talent_media_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talent_media_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_profile_field_options: {
        Row: {
          created_at: string | null
          field_id: string | null
          id: string
          label: string
          position: number
          value: string
        }
        Insert: {
          created_at?: string | null
          field_id?: string | null
          id?: string
          label: string
          position?: number
          value: string
        }
        Update: {
          created_at?: string | null
          field_id?: string | null
          id?: string
          label?: string
          position?: number
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "talent_profile_field_options_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "talent_profile_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_profile_fields: {
        Row: {
          advanced_rules: Json | null
          created_at: string | null
          field_type: Database["public"]["Enums"]["field_type"]
          guest_access: boolean | null
          id: string
          is_active: boolean | null
          is_required: boolean | null
          label: string
          position: number
          show_on_signup: boolean | null
          tab: string
          updated_at: string | null
        }
        Insert: {
          advanced_rules?: Json | null
          created_at?: string | null
          field_type: Database["public"]["Enums"]["field_type"]
          guest_access?: boolean | null
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          label: string
          position?: number
          show_on_signup?: boolean | null
          tab?: string
          updated_at?: string | null
        }
        Update: {
          advanced_rules?: Json | null
          created_at?: string | null
          field_type?: Database["public"]["Enums"]["field_type"]
          guest_access?: boolean | null
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          label?: string
          position?: number
          show_on_signup?: boolean | null
          tab?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      talent_profiles: {
        Row: {
          category: string | null
          country: string | null
          created_at: string | null
          evaluation_status: string | null
          id: string
          internal_remarks: string | null
          phone_number: string | null
          updated_at: string | null
          user_id: string | null
          whatsapp_number: string | null
        }
        Insert: {
          category?: string | null
          country?: string | null
          created_at?: string | null
          evaluation_status?: string | null
          id?: string
          internal_remarks?: string | null
          phone_number?: string | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          category?: string | null
          country?: string | null
          created_at?: string | null
          evaluation_status?: string | null
          id?: string
          internal_remarks?: string | null
          phone_number?: string | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "talent_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talent_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_social_media: {
        Row: {
          created_at: string | null
          id: string
          platform: string
          profile_url: string
          talent_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          platform: string
          profile_url: string
          talent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          platform?: string
          profile_url?: string
          talent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "talent_social_media_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talent_social_media_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_logs: {
        Row: {
          action_type: string
          created_at: string | null
          details: Json | null
          id: string
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_key: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_key: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_key?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string | null
          first_name: string | null
          full_name: string | null
          gender: string | null
          id: string
          last_login: string | null
          last_name: string | null
          mobile_phone: string | null
          nationality: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"]
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          last_login?: string | null
          last_name?: string | null
          mobile_phone?: string | null
          nationality?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          last_login?: string | null
          last_name?: string | null
          mobile_phone?: string | null
          nationality?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
        }
        Relationships: [
          {
            foreignKeyName: "users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      video_tasks: {
        Row: {
          assignee_id: string | null
          completed_at: string | null
          created_at: string | null
          due_date: string | null
          id: string
          status: string | null
          task_type: string | null
          updated_at: string | null
          video_id: string | null
        }
        Insert: {
          assignee_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          task_type?: string | null
          updated_at?: string | null
          video_id?: string | null
        }
        Update: {
          assignee_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          task_type?: string | null
          updated_at?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_tasks_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "project_videos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          gender: string | null
          id: string | null
          last_login: string | null
          last_name: string | null
          mobile_phone: string | null
          nationality: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          status: Database["public"]["Enums"]["user_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      casting_status: "open" | "closed"
      casting_type: "internal" | "external"
      field_type:
        | "text"
        | "long_text"
        | "email"
        | "date"
        | "single_select"
        | "multi_select"
        | "number"
        | "phone"
        | "blank_space"
        | "custom_dropdown"
        | "fixed_dropdown"
      media_category: "photo" | "video" | "audio" | "document" | "other"
      user_role:
        | "super_admin"
        | "admin"
        | "super_user"
        | "user"
        | "guest"
        | "ugc_talent"
        | "translator"
        | "reviewer"
        | "voice_over_artist"
        | "agent"
        | "scout"
      user_status: "active" | "inactive" | "suspended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
