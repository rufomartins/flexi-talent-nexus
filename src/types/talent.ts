export interface DuoPartner {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_url?: string;
}

export interface TalentProfile {
  id: string;
  user_id: string | null;
  talent_category: 'UGC' | 'TRANSLATOR' | 'REVIEWER' | 'VOICE_OVER' | null;
  country: string | null;
  evaluation_status: string | null;
  is_duo: boolean | null;
  duo_name?: string | null;
  partner_id?: string | null;
  created_at: string | null;
  updated_at: string | null;
  agent_id: string | null;
  availability: Json | null;  // Changed from Record<string, any> to Json
  category: string | null;
  experience_level: string | null;
  fee_range: Json | null;  // Also ensure this matches
  native_language: string | null;
  partner?: DuoPartner;
  users: {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'casting_availability' | 'booking_confirmation' | 'talent_application' | 'project_update' | 'talent_invitation';
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

// Add Json type if not already imported
import { Json } from '@/integrations/supabase/types';