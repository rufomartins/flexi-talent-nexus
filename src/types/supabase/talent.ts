import type { BaseEntity, Json } from './base';

export interface TalentProfile extends BaseEntity {
  user_id: string;
  agent_id?: string;
  availability: Json;
  category?: string;
  country?: string;
  created_by?: string;
  duo_name?: string;
  evaluation_status: string;
  experience_level?: string;
  fee_range?: Json;
  internal_remarks?: string;
  is_duo?: boolean;
  native_language?: string;
  partner_id?: string;
  phone_number?: string;
  talent_category?: string;
  talent_type?: string;
  whatsapp_number?: string;
  users: {
    id: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    avatar_url?: string;
  };
}