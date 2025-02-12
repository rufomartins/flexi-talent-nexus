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
      api_settings: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      assignment_history: {
        Row: {
          assignment_id: string | null
          changed_by: string | null
          created_at: string | null
          id: string
          new_status: string | null
          new_user_id: string | null
          previous_status: string | null
          previous_user_id: string | null
        }
        Insert: {
          assignment_id?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status?: string | null
          new_user_id?: string | null
          previous_status?: string | null
          previous_user_id?: string | null
        }
        Update: {
          assignment_id?: string | null
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status?: string | null
          new_user_id?: string | null
          previous_status?: string | null
          previous_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignment_history_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "role_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_history_new_user_id_fkey"
            columns: ["new_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_history_new_user_id_fkey"
            columns: ["new_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_history_previous_user_id_fkey"
            columns: ["previous_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_history_previous_user_id_fkey"
            columns: ["previous_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_contracts: {
        Row: {
          booking_id: string | null
          contract_type: string
          contract_url: string | null
          created_at: string | null
          id: string
          signed_at: string | null
          signed_url: string | null
          updated_at: string | null
        }
        Insert: {
          booking_id?: string | null
          contract_type: string
          contract_url?: string | null
          created_at?: string | null
          id?: string
          signed_at?: string | null
          signed_url?: string | null
          updated_at?: string | null
        }
        Update: {
          booking_id?: string | null
          contract_type?: string
          contract_url?: string | null
          created_at?: string | null
          id?: string
          signed_at?: string | null
          signed_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_contracts_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_files: {
        Row: {
          booking_id: string | null
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_files_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_timeline_events: {
        Row: {
          booking_id: string
          created_at: string | null
          details: Json
          event_type: Database["public"]["Enums"]["booking_event_type"]
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          details?: Json
          event_type: Database["public"]["Enums"]["booking_event_type"]
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          details?: Json
          event_type?: Database["public"]["Enums"]["booking_event_type"]
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_timeline_events_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_timeline_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_timeline_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          casting_id: string | null
          created_at: string | null
          created_by: string | null
          details: string | null
          email_template_id: string | null
          end_date: string
          final_fee: number | null
          id: string
          payment_status: string | null
          project_id: string | null
          start_date: string
          status: Database["public"]["Enums"]["booking_status"] | null
          talent_fee: number | null
          talent_id: string | null
          updated_at: string | null
        }
        Insert: {
          casting_id?: string | null
          created_at?: string | null
          created_by?: string | null
          details?: string | null
          email_template_id?: string | null
          end_date: string
          final_fee?: number | null
          id?: string
          payment_status?: string | null
          project_id?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          talent_fee?: number | null
          talent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          casting_id?: string | null
          created_at?: string | null
          created_by?: string | null
          details?: string | null
          email_template_id?: string | null
          end_date?: string
          final_fee?: number | null
          id?: string
          payment_status?: string | null
          project_id?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          talent_fee?: number | null
          talent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_casting_id_fkey"
            columns: ["casting_id"]
            isOneToOne: false
            referencedRelation: "castings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_email_template_id_fkey"
            columns: ["email_template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
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
          preferences: Json | null
          status: string | null
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
          preferences?: Json | null
          status?: string | null
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
          preferences?: Json | null
          status?: string | null
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
      conversation_participants: {
        Row: {
          conversation_id: string | null
          created_at: string | null
          id: string
          last_read_at: string | null
          user_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          last_read_at?: string | null
          user_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          last_read_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          project_id: string | null
          title: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      deadline_preferences: {
        Row: {
          created_at: string | null
          deadline_statuses: string[] | null
          id: string
          notification_channels: string[] | null
          updated_at: string | null
          user_id: string
          warning_days: number[] | null
        }
        Insert: {
          created_at?: string | null
          deadline_statuses?: string[] | null
          id?: string
          notification_channels?: string[] | null
          updated_at?: string | null
          user_id: string
          warning_days?: number[] | null
        }
        Update: {
          created_at?: string | null
          deadline_statuses?: string[] | null
          id?: string
          notification_channels?: string[] | null
          updated_at?: string | null
          user_id?: string
          warning_days?: number[] | null
        }
        Relationships: []
      }
      email_conversations: {
        Row: {
          created_at: string | null
          id: string
          last_message_at: string | null
          status: Database["public"]["Enums"]["email_thread_status"] | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          status?: Database["public"]["Enums"]["email_thread_status"] | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          status?: Database["public"]["Enums"]["email_thread_status"] | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          body: string
          error_message: string | null
          id: string
          metadata: Json | null
          recipient: string
          sent_at: string | null
          status: string
          subject: string
          template_id: string | null
        }
        Insert: {
          body: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          recipient: string
          sent_at?: string | null
          status: string
          subject: string
          template_id?: string | null
        }
        Update: {
          body?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          recipient?: string
          sent_at?: string | null
          status?: string
          subject?: string
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_messages: {
        Row: {
          attachments: Json | null
          bcc_email: string[] | null
          body: string
          cc_email: string[] | null
          conversation_id: string | null
          created_at: string | null
          direction: string
          from_email: string
          headers: Json | null
          html_body: string | null
          id: string
          metadata: Json | null
          parent_message_id: string | null
          status: Database["public"]["Enums"]["email_status"] | null
          subject: string
          to_email: string[]
          updated_at: string | null
        }
        Insert: {
          attachments?: Json | null
          bcc_email?: string[] | null
          body: string
          cc_email?: string[] | null
          conversation_id?: string | null
          created_at?: string | null
          direction: string
          from_email: string
          headers?: Json | null
          html_body?: string | null
          id?: string
          metadata?: Json | null
          parent_message_id?: string | null
          status?: Database["public"]["Enums"]["email_status"] | null
          subject: string
          to_email: string[]
          updated_at?: string | null
        }
        Update: {
          attachments?: Json | null
          bcc_email?: string[] | null
          body?: string
          cc_email?: string[] | null
          conversation_id?: string | null
          created_at?: string | null
          direction?: string
          from_email?: string
          headers?: Json | null
          html_body?: string | null
          id?: string
          metadata?: Json | null
          parent_message_id?: string | null
          status?: Database["public"]["Enums"]["email_status"] | null
          subject?: string
          to_email?: string[]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "email_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_messages_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "email_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      email_settings: {
        Row: {
          created_at: string | null
          enable_receiving: boolean | null
          id: string
          is_active: boolean | null
          sender_email: string
          stage: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          enable_receiving?: boolean | null
          id?: string
          is_active?: boolean | null
          sender_email: string
          stage: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          enable_receiving?: boolean | null
          id?: string
          is_active?: boolean | null
          sender_email?: string
          stage?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          name: string
          subject: string
          type: Database["public"]["Enums"]["email_template_type"]
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          body: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          type: Database["public"]["Enums"]["email_template_type"]
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          body?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          type?: Database["public"]["Enums"]["email_template_type"]
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      equipment: {
        Row: {
          created_at: string | null
          equipment_type: string
          id: string
          notes: string | null
          required_shots: string[] | null
          shot_list_id: string | null
          specifications: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          equipment_type: string
          id?: string
          notes?: string | null
          required_shots?: string[] | null
          shot_list_id?: string | null
          specifications?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          equipment_type?: string
          id?: string
          notes?: string | null
          required_shots?: string[] | null
          shot_list_id?: string | null
          specifications?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_shot_list_id_fkey"
            columns: ["shot_list_id"]
            isOneToOne: false
            referencedRelation: "shot_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      error_logs: {
        Row: {
          code: string | null
          details: Json | null
          id: string
          message: string
          stack: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          code?: string | null
          details?: Json | null
          id?: string
          message: string
          stack?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          code?: string | null
          details?: Json | null
          id?: string
          message?: string
          stack?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      feature_toggles: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          feature_key: string
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          feature_key: string
          id?: string
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          feature_key?: string
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      guest_selections: {
        Row: {
          casting_id: string | null
          comments: string | null
          created_at: string | null
          guest_id: string | null
          id: string
          liked: boolean | null
          preference_order: number | null
          status: string | null
          talent_id: string | null
          updated_at: string | null
        }
        Insert: {
          casting_id?: string | null
          comments?: string | null
          created_at?: string | null
          guest_id?: string | null
          id?: string
          liked?: boolean | null
          preference_order?: number | null
          status?: string | null
          talent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          casting_id?: string | null
          comments?: string | null
          created_at?: string | null
          guest_id?: string | null
          id?: string
          liked?: boolean | null
          preference_order?: number | null
          status?: string | null
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
      interviews: {
        Row: {
          candidate_id: string | null
          created_at: string
          id: string
          interviewer_id: string | null
          notes: string | null
          scheduled_at: string
          status: Database["public"]["Enums"]["interview_status"] | null
          updated_at: string
        }
        Insert: {
          candidate_id?: string | null
          created_at?: string
          id?: string
          interviewer_id?: string | null
          notes?: string | null
          scheduled_at: string
          status?: Database["public"]["Enums"]["interview_status"] | null
          updated_at?: string
        }
        Update: {
          candidate_id?: string | null
          created_at?: string
          id?: string
          interviewer_id?: string | null
          notes?: string | null
          scheduled_at?: string
          status?: Database["public"]["Enums"]["interview_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviews_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "onboarding_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_interviewer_id_fkey"
            columns: ["interviewer_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_interviewer_id_fkey"
            columns: ["interviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      languages: {
        Row: {
          code: string | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string | null
          created_at: string | null
          id: string
          name: string
          shot_list_id: string | null
          special_requirements: string | null
          status: Database["public"]["Enums"]["location_status"] | null
          time_of_day: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          id?: string
          name: string
          shot_list_id?: string | null
          special_requirements?: string | null
          status?: Database["public"]["Enums"]["location_status"] | null
          time_of_day?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          id?: string
          name?: string
          shot_list_id?: string | null
          special_requirements?: string | null
          status?: Database["public"]["Enums"]["location_status"] | null
          time_of_day?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_shot_list_id_fkey"
            columns: ["shot_list_id"]
            isOneToOne: false
            referencedRelation: "shot_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      message_reads: {
        Row: {
          id: string
          message_id: string
          read_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          message_id: string
          read_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          message_id?: string
          read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reads_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string | null
          content_type: string | null
          conversation_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          metadata: Json | null
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          content_type?: string | null
          conversation_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          metadata?: Json | null
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          content_type?: string | null
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          metadata?: Json | null
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_conversation"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          message: string
          metadata: Json | null
          notification_type: Database["public"]["Enums"]["notification_type"]
          phone_number: string
          recipient_id: string | null
          sent_at: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          message: string
          metadata?: Json | null
          notification_type: Database["public"]["Enums"]["notification_type"]
          phone_number: string
          recipient_id?: string | null
          sent_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          notification_type?: Database["public"]["Enums"]["notification_type"]
          phone_number?: string
          recipient_id?: string | null
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_queue: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          processed_at: string | null
          status: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          status?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          status?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_queue_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_queue_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_candidates: {
        Row: {
          archive_status: boolean | null
          biography: string | null
          chatbot_status: string | null
          communication_status: string | null
          created_at: string
          date_added_to_screening: string | null
          email: string
          external_url: string | null
          first_name: string | null
          followers_count: number | null
          following_count: number | null
          full_name: string | null
          id: string
          interview_date: string | null
          invite_expiry_date: string | null
          invite_sent_date: string | null
          language: string | null
          last_activity_date: string | null
          last_name: string | null
          name: string
          native_language: string | null
          notes: string | null
          phone: string | null
          profile_url: string | null
          remarks: string | null
          scout_id: string | null
          source: string | null
          stage: string | null
          status: Database["public"]["Enums"]["candidate_status"]
          updated_at: string
          username: string | null
          video_demo_url: string | null
          video_progress: number | null
          video_watched: boolean | null
        }
        Insert: {
          archive_status?: boolean | null
          biography?: string | null
          chatbot_status?: string | null
          communication_status?: string | null
          created_at?: string
          date_added_to_screening?: string | null
          email: string
          external_url?: string | null
          first_name?: string | null
          followers_count?: number | null
          following_count?: number | null
          full_name?: string | null
          id?: string
          interview_date?: string | null
          invite_expiry_date?: string | null
          invite_sent_date?: string | null
          language?: string | null
          last_activity_date?: string | null
          last_name?: string | null
          name: string
          native_language?: string | null
          notes?: string | null
          phone?: string | null
          profile_url?: string | null
          remarks?: string | null
          scout_id?: string | null
          source?: string | null
          stage?: string | null
          status?: Database["public"]["Enums"]["candidate_status"]
          updated_at?: string
          username?: string | null
          video_demo_url?: string | null
          video_progress?: number | null
          video_watched?: boolean | null
        }
        Update: {
          archive_status?: boolean | null
          biography?: string | null
          chatbot_status?: string | null
          communication_status?: string | null
          created_at?: string
          date_added_to_screening?: string | null
          email?: string
          external_url?: string | null
          first_name?: string | null
          followers_count?: number | null
          following_count?: number | null
          full_name?: string | null
          id?: string
          interview_date?: string | null
          invite_expiry_date?: string | null
          invite_sent_date?: string | null
          language?: string | null
          last_activity_date?: string | null
          last_name?: string | null
          name?: string
          native_language?: string | null
          notes?: string | null
          phone?: string | null
          profile_url?: string | null
          remarks?: string | null
          scout_id?: string | null
          source?: string | null
          stage?: string | null
          status?: Database["public"]["Enums"]["candidate_status"]
          updated_at?: string
          username?: string | null
          video_demo_url?: string | null
          video_progress?: number | null
          video_watched?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_candidates_scout_id_fkey"
            columns: ["scout_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_candidates_scout_id_fkey"
            columns: ["scout_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_chat_messages: {
        Row: {
          candidate_id: string | null
          created_at: string | null
          id: string
          message: string
          sender_type: string
        }
        Insert: {
          candidate_id?: string | null
          created_at?: string | null
          id?: string
          message: string
          sender_type: string
        }
        Update: {
          candidate_id?: string | null
          created_at?: string | null
          id?: string
          message?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_chat_messages_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "onboarding_candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_email_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          message: string
          name: string
          subject: string
          type: Database["public"]["Enums"]["onboarding_template_type"]
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          message: string
          name: string
          subject: string
          type: Database["public"]["Enums"]["onboarding_template_type"]
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          message?: string
          name?: string
          subject?: string
          type?: Database["public"]["Enums"]["onboarding_template_type"]
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      onboarding_import_sessions: {
        Row: {
          created_at: string | null
          created_by: string | null
          error_message: string | null
          file_name: string
          file_path: string
          id: string
          imported_count: number | null
          status: string
          total_rows: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          error_message?: string | null
          file_name: string
          file_path: string
          id?: string
          imported_count?: number | null
          status?: string
          total_rows?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          error_message?: string | null
          file_name?: string
          file_path?: string
          id?: string
          imported_count?: number | null
          status?: string
          total_rows?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      onboarding_inbox: {
        Row: {
          attachments: Json | null
          body: string | null
          error: string | null
          headers: Json | null
          id: string
          metadata: Json | null
          processed: boolean | null
          received_at: string | null
          recipient: string
          sender: string
          subject: string | null
        }
        Insert: {
          attachments?: Json | null
          body?: string | null
          error?: string | null
          headers?: Json | null
          id?: string
          metadata?: Json | null
          processed?: boolean | null
          received_at?: string | null
          recipient: string
          sender: string
          subject?: string | null
        }
        Update: {
          attachments?: Json | null
          body?: string | null
          error?: string | null
          headers?: Json | null
          id?: string
          metadata?: Json | null
          processed?: boolean | null
          received_at?: string | null
          recipient?: string
          sender?: string
          subject?: string | null
        }
        Relationships: []
      }
      onboarding_interviews: {
        Row: {
          candidate_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          scheduled_at: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          candidate_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          scheduled_at: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          candidate_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          scheduled_at?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_interviews_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "onboarding_candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_settings: {
        Row: {
          allowed_roles: string[] | null
          created_at: string | null
          feature_key: string
          id: string
          is_enabled: boolean | null
          updated_at: string | null
          value: Json
        }
        Insert: {
          allowed_roles?: string[] | null
          created_at?: string | null
          feature_key: string
          id?: string
          is_enabled?: boolean | null
          updated_at?: string | null
          value?: Json
        }
        Update: {
          allowed_roles?: string[] | null
          created_at?: string | null
          feature_key?: string
          id?: string
          is_enabled?: boolean | null
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      onboarding_sms_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          message: string
          name: string
          type: Database["public"]["Enums"]["onboarding_template_type"] | null
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          message: string
          name: string
          type?: Database["public"]["Enums"]["onboarding_template_type"] | null
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          message?: string
          name?: string
          type?: Database["public"]["Enums"]["onboarding_template_type"] | null
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      project_countries: {
        Row: {
          country_name: string
          created_at: string | null
          id: string
          project_id: string | null
          updated_at: string | null
        }
        Insert: {
          country_name: string
          created_at?: string | null
          id?: string
          project_id?: string | null
          updated_at?: string | null
        }
        Update: {
          country_name?: string
          created_at?: string | null
          id?: string
          project_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_countries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_files: {
        Row: {
          category: string | null
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          project_id: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          project_id: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          project_id?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_languages: {
        Row: {
          country_id: string | null
          created_at: string | null
          id: string
          language_name: string
          updated_at: string | null
        }
        Insert: {
          country_id?: string | null
          created_at?: string | null
          id?: string
          language_name: string
          updated_at?: string | null
        }
        Update: {
          country_id?: string | null
          created_at?: string | null
          id?: string
          language_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_languages_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "project_countries"
            referencedColumns: ["id"]
          },
        ]
      }
      project_managers: {
        Row: {
          created_at: string | null
          id: string
          project_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_managers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_managers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_managers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tasks: {
        Row: {
          created_at: string | null
          delivery_status:
            | Database["public"]["Enums"]["project_delivery_status"]
            | null
          id: string
          language_id: string | null
          name: string
          priority: string | null
          review_status:
            | Database["public"]["Enums"]["project_review_status"]
            | null
          script_status:
            | Database["public"]["Enums"]["project_script_status"]
            | null
          status: string | null
          talent_status:
            | Database["public"]["Enums"]["project_talent_status"]
            | null
          translation_status:
            | Database["public"]["Enums"]["project_translation_status"]
            | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_status?:
            | Database["public"]["Enums"]["project_delivery_status"]
            | null
          id?: string
          language_id?: string | null
          name: string
          priority?: string | null
          review_status?:
            | Database["public"]["Enums"]["project_review_status"]
            | null
          script_status?:
            | Database["public"]["Enums"]["project_script_status"]
            | null
          status?: string | null
          talent_status?:
            | Database["public"]["Enums"]["project_talent_status"]
            | null
          translation_status?:
            | Database["public"]["Enums"]["project_translation_status"]
            | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_status?:
            | Database["public"]["Enums"]["project_delivery_status"]
            | null
          id?: string
          language_id?: string | null
          name?: string
          priority?: string | null
          review_status?:
            | Database["public"]["Enums"]["project_review_status"]
            | null
          script_status?:
            | Database["public"]["Enums"]["project_script_status"]
            | null
          status?: string | null
          talent_status?:
            | Database["public"]["Enums"]["project_talent_status"]
            | null
          translation_status?:
            | Database["public"]["Enums"]["project_translation_status"]
            | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "project_languages"
            referencedColumns: ["id"]
          },
        ]
      }
      project_templates: {
        Row: {
          content: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
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
          active_tasks_count: number | null
          client_id: string | null
          color_code: string | null
          completion_percentage: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          progress_percentage: number | null
          project_manager_id: string | null
          start_date: string | null
          status: string | null
          type: string | null
          upcoming_deadlines_count: number | null
          updated_at: string | null
        }
        Insert: {
          active_tasks_count?: number | null
          client_id?: string | null
          color_code?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          progress_percentage?: number | null
          project_manager_id?: string | null
          start_date?: string | null
          status?: string | null
          type?: string | null
          upcoming_deadlines_count?: number | null
          updated_at?: string | null
        }
        Update: {
          active_tasks_count?: number | null
          client_id?: string | null
          color_code?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          progress_percentage?: number | null
          project_manager_id?: string | null
          start_date?: string | null
          status?: string | null
          type?: string | null
          upcoming_deadlines_count?: number | null
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
      role_assignments: {
        Row: {
          assigned_at: string | null
          created_at: string | null
          created_by: string | null
          due_date: string | null
          id: string
          last_updated: string | null
          role_type: string
          start_date: string | null
          status: string
          task_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          created_at?: string | null
          created_by?: string | null
          due_date?: string | null
          id?: string
          last_updated?: string | null
          role_type: string
          start_date?: string | null
          status: string
          task_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          created_at?: string | null
          created_by?: string | null
          due_date?: string | null
          id?: string
          last_updated?: string | null
          role_type?: string
          start_date?: string | null
          status?: string
          task_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_assignments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_assignments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_assignments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "project_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      share_links: {
        Row: {
          allow_comments: boolean
          casting_id: string
          created_at: string
          created_by: string
          expires_at: string
          guest_id: string
          id: string
          readonly: boolean
          token: string
        }
        Insert: {
          allow_comments?: boolean
          casting_id: string
          created_at?: string
          created_by: string
          expires_at: string
          guest_id: string
          id?: string
          readonly?: boolean
          token: string
        }
        Update: {
          allow_comments?: boolean
          casting_id?: string
          created_at?: string
          created_by?: string
          expires_at?: string
          guest_id?: string
          id?: string
          readonly?: boolean
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "share_links_casting_id_fkey"
            columns: ["casting_id"]
            isOneToOne: false
            referencedRelation: "castings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "share_links_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "casting_guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "share_links_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "casting_guests"
            referencedColumns: ["id"]
          },
        ]
      }
      shot_lists: {
        Row: {
          created_at: string | null
          id: string
          shared_with: Json | null
          task_id: string | null
          template_id: string | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          shared_with?: Json | null
          task_id?: string | null
          template_id?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          shared_with?: Json | null
          task_id?: string | null
          template_id?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shot_lists_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "project_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shot_lists_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "shot_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      shots: {
        Row: {
          created_at: string | null
          description: string | null
          frame_type: string | null
          id: string
          location_id: string | null
          notes: string | null
          sequence_order: number
          shot_list_id: string | null
          shot_number: number
          status: Database["public"]["Enums"]["shot_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          frame_type?: string | null
          id?: string
          location_id?: string | null
          notes?: string | null
          sequence_order: number
          shot_list_id?: string | null
          shot_number: number
          status?: Database["public"]["Enums"]["shot_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          frame_type?: string | null
          id?: string
          location_id?: string | null
          notes?: string | null
          sequence_order?: number
          shot_list_id?: string | null
          shot_number?: number
          status?: Database["public"]["Enums"]["shot_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_location"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shots_shot_list_id_fkey"
            columns: ["shot_list_id"]
            isOneToOne: false
            referencedRelation: "shot_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_logs: {
        Row: {
          candidate_id: string | null
          created_at: string | null
          created_by: string | null
          error_message: string | null
          id: string
          message: string
          module: string | null
          phone_number: string
          sent_at: string | null
          status: Database["public"]["Enums"]["sms_status"] | null
        }
        Insert: {
          candidate_id?: string | null
          created_at?: string | null
          created_by?: string | null
          error_message?: string | null
          id?: string
          message: string
          module?: string | null
          phone_number: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["sms_status"] | null
        }
        Update: {
          candidate_id?: string | null
          created_at?: string | null
          created_by?: string | null
          error_message?: string | null
          id?: string
          message?: string
          module?: string | null
          phone_number?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["sms_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "sms_logs_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "onboarding_candidates"
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
            foreignKeyName: "fk_talent_calendar_casting"
            columns: ["casting_id"]
            isOneToOne: false
            referencedRelation: "castings"
            referencedColumns: ["id"]
          },
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
          internal_notes: string | null
          is_platform_project: boolean | null
          job_title: string
          performance_rating: number | null
          project_id: string | null
          start_date: string | null
          talent_id: string | null
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          internal_notes?: string | null
          is_platform_project?: boolean | null
          job_title: string
          performance_rating?: number | null
          project_id?: string | null
          start_date?: string | null
          talent_id?: string | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          internal_notes?: string | null
          is_platform_project?: boolean | null
          job_title?: string
          performance_rating?: number | null
          project_id?: string | null
          start_date?: string | null
          talent_id?: string | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "talent_jobs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
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
      talent_metrics: {
        Row: {
          created_at: string | null
          id: string
          metric_type: string
          metric_value: number
          notes: string | null
          project_id: string | null
          recorded_at: string | null
          talent_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metric_type: string
          metric_value: number
          notes?: string | null
          project_id?: string | null
          recorded_at?: string | null
          talent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metric_type?: string
          metric_value?: number
          notes?: string | null
          project_id?: string | null
          recorded_at?: string | null
          talent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "talent_metrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talent_metrics_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talent_metrics_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_notes: {
        Row: {
          additional_notes: string | null
          created_at: string | null
          id: string
          instructions: string | null
          required_props: string | null
          shot_list_id: string | null
          shot_reference: string | null
          updated_at: string | null
        }
        Insert: {
          additional_notes?: string | null
          created_at?: string | null
          id?: string
          instructions?: string | null
          required_props?: string | null
          shot_list_id?: string | null
          shot_reference?: string | null
          updated_at?: string | null
        }
        Update: {
          additional_notes?: string | null
          created_at?: string | null
          id?: string
          instructions?: string | null
          required_props?: string | null
          shot_list_id?: string | null
          shot_reference?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "talent_notes_shot_list_id_fkey"
            columns: ["shot_list_id"]
            isOneToOne: false
            referencedRelation: "shot_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_notification_preferences: {
        Row: {
          created_at: string | null
          email_enabled: boolean | null
          email_frequency: string | null
          in_app_enabled: boolean | null
          reminder_days: number[] | null
          talent_id: string
          types: Database["public"]["Enums"]["notification_type"][] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email_enabled?: boolean | null
          email_frequency?: string | null
          in_app_enabled?: boolean | null
          reminder_days?: number[] | null
          talent_id: string
          types?: Database["public"]["Enums"]["notification_type"][] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email_enabled?: boolean | null
          email_frequency?: string | null
          in_app_enabled?: boolean | null
          reminder_days?: number[] | null
          talent_id?: string
          types?: Database["public"]["Enums"]["notification_type"][] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "talent_notification_preferences_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: true
            referencedRelation: "talent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          read: boolean | null
          talent_id: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean | null
          talent_id?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean | null
          talent_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: [
          {
            foreignKeyName: "talent_notifications_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
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
          agent_id: string | null
          availability: Json | null
          category: string | null
          country: string | null
          created_at: string | null
          created_by: string | null
          duo_name: string | null
          evaluation_status: string | null
          experience_level: string | null
          fee_range: Json | null
          id: string
          internal_remarks: string | null
          is_duo: boolean | null
          native_language: string | null
          partner_id: string | null
          phone_number: string | null
          talent_category: Database["public"]["Enums"]["talent_category"] | null
          talent_type: Database["public"]["Enums"]["talent_type"] | null
          updated_at: string | null
          user_id: string | null
          whatsapp_number: string | null
        }
        Insert: {
          agent_id?: string | null
          availability?: Json | null
          category?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          duo_name?: string | null
          evaluation_status?: string | null
          experience_level?: string | null
          fee_range?: Json | null
          id?: string
          internal_remarks?: string | null
          is_duo?: boolean | null
          native_language?: string | null
          partner_id?: string | null
          phone_number?: string | null
          talent_category?:
            | Database["public"]["Enums"]["talent_category"]
            | null
          talent_type?: Database["public"]["Enums"]["talent_type"] | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          agent_id?: string | null
          availability?: Json | null
          category?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          duo_name?: string | null
          evaluation_status?: string | null
          experience_level?: string | null
          fee_range?: Json | null
          id?: string
          internal_remarks?: string | null
          is_duo?: boolean | null
          native_language?: string | null
          partner_id?: string | null
          phone_number?: string | null
          talent_category?:
            | Database["public"]["Enums"]["talent_category"]
            | null
          talent_type?: Database["public"]["Enums"]["talent_type"] | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "talent_profiles_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talent_profiles_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talent_profiles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talent_profiles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talent_profiles_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
            referencedColumns: ["id"]
          },
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
          project_id: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          details?: Json | null
          id?: string
          project_id?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          project_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
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
          email: string | null
          first_name: string | null
          full_name: string | null
          gender: string | null
          id: string
          last_login: string | null
          last_name: string | null
          mobile_phone: string | null
          nationality: string | null
          phone_number_verified: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          sms_notification_types:
            | Database["public"]["Enums"]["notification_type"][]
            | null
          sms_notifications_enabled: boolean | null
          status: Database["public"]["Enums"]["user_status"]
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          last_login?: string | null
          last_name?: string | null
          mobile_phone?: string | null
          nationality?: string | null
          phone_number_verified?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          sms_notification_types?:
            | Database["public"]["Enums"]["notification_type"][]
            | null
          sms_notifications_enabled?: boolean | null
          status?: Database["public"]["Enums"]["user_status"]
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          last_login?: string | null
          last_name?: string | null
          mobile_phone?: string | null
          nationality?: string | null
          phone_number_verified?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          sms_notification_types?:
            | Database["public"]["Enums"]["notification_type"][]
            | null
          sms_notifications_enabled?: boolean | null
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
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string | null
          last_login?: string | null
          last_name?: string | null
          mobile_phone?: string | null
          nationality?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["user_status"] | null
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string | null
          last_login?: string | null
          last_name?: string | null
          mobile_phone?: string | null
          nationality?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["user_status"] | null
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
      booking_email_template_type:
        | "casting_availability"
        | "booking_confirmation"
        | "talent_application"
        | "project_update"
        | "talent_invitation"
      booking_event_type:
        | "status_change"
        | "file_upload"
        | "comment"
        | "email_sent"
        | "booking_created"
        | "booking_updated"
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      candidate_status:
        | "new"
        | "emailed"
        | "interviewed"
        | "approved"
        | "not_interested"
      casting_status: "open" | "closed"
      casting_type: "internal" | "external"
      email_status: "unread" | "read" | "archived" | "deleted"
      email_template_type:
        | "casting_availability"
        | "booking_confirmation"
        | "talent_application"
        | "project_update"
        | "talent_invitation"
      email_thread_status: "active" | "archived" | "deleted"
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
      interview_status: "scheduled" | "completed" | "canceled"
      location_status: "Pending" | "Confirmed" | "Unavailable"
      media_category: "photo" | "video" | "audio" | "document" | "other"
      notification_type:
        | "STATUS_CHANGE"
        | "ASSIGNMENT_UPDATE"
        | "PROFILE_UPDATE"
        | "DUO_PARTNER_CHANGE"
        | "PROJECT_MILESTONE"
        | "PAYMENT_STATUS"
        | "CASTING_OPPORTUNITY"
        | "BOOKING_CONFIRMATION"
        | "REVIEW_FEEDBACK"
        | "DOCUMENT_UPDATE"
        | "NEW_ASSIGNMENT"
        | "DEADLINE_WARNING"
        | "DEADLINE_APPROACHING"
        | "DEADLINE_OVERDUE"
        | "CASTING_AVAILABILITY"
        | "TALENT_APPLICATION"
        | "PROJECT_UPDATE"
        | "PAYMENT_REMINDER"
        | "EMAIL"
        | "SMS"
      onboarding_stage: "ingest" | "process" | "screening" | "results"
      onboarding_template_type:
        | "welcome"
        | "interview_scheduled"
        | "interview_reminder"
        | "approval"
        | "rejection"
      project_delivery_status: "Pending" | "Delivered" | "R Pending"
      project_review_status: "Internal Review" | "Client Review" | "Approved"
      project_script_status: "Pending" | "In Progress" | "Approved"
      project_talent_status:
        | "Booked"
        | "Shooting"
        | "Delivered"
        | "Reshoot"
        | "Approved"
      project_translation_status: "Pending" | "In Progress" | "Approved"
      shot_status: "Pending" | "In Progress" | "Completed"
      sms_status: "pending" | "sent" | "failed"
      talent_category: "UGC" | "TRANSLATOR" | "REVIEWER" | "VOICE_OVER"
      talent_type: "individual" | "duo" | "agent"
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
