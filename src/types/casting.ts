import { User } from "./user";

export type CastingType = 'internal' | 'external';
export type CastingStatus = 'open' | 'closed';

export interface CastingFormData {
  name: string;
  type: CastingType;
  status: CastingStatus;
  client_id?: string;
  project_manager_id?: string;
  scout_id?: string;
  logo_url?: string;
  briefing?: string;
  show_briefing_on_signup: boolean;
  allow_talent_portal_apply: boolean;
  description?: string;
}

export interface CastingField {
  id: string;
  label: string;
  fieldType: 'text' | 'email' | 'select' | 'space' | 'dropdown' | 'textarea' | 'date';
  signUp: boolean;
  required: boolean;
  guestAccess: boolean;
  position: number;
}