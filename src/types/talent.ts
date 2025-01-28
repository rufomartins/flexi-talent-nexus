export interface TalentProfile {
  id: string;
  user_id: string;
  talent_category: 'UGC' | 'TRANSLATOR' | 'REVIEWER' | 'VOICE_OVER';
  country: string;
  evaluation_status: string;
  is_duo: boolean;
  created_at: string;
  updated_at: string;
  agent_id?: string;
  availability: Record<string, any> | null;
  category?: string;
  experience_level: string;
  fee_range: Record<string, any> | null;
  native_language: string;
  users: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  casting_talents: Array<{
    castings: {
      name: string;
    };
  }>;
}