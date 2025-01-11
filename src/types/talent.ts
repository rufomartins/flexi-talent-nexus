export interface TalentProfile {
  id: string;
  user_id: string;
  talent_category: 'UGC' | 'TRANSLATOR' | 'REVIEWER' | 'VOICE_OVER';
  country: string;
  evaluation_status: 'approved' | 'under_evaluation' | 'rejected';
  is_duo: boolean;
  duo_name?: string;
  partner_id?: string;
  created_at: string;
  updated_at: string;
  agent_id: string | null;
  availability: Record<string, any>;
  category: string;
  experience_level: string;
  fee_range: Record<string, any>;
  native_language: string;
  users: {
    id: string;
    full_name: string;
    avatar_url?: string;
    email: string;
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