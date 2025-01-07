export type CastingStatus = 'open' | 'closed';
export type CastingType = 'internal' | 'external';

export interface CastingClient {
  full_name: string | null;
}

export interface ProjectManager {
  full_name: string | null;
}

export interface Casting {
  id: string;
  name: string;
  type: CastingType;
  status: CastingStatus;
  logo_url: string | null;
  client_id: string | null;
  client?: CastingClient | null;
  project_manager?: ProjectManager | null;
  description?: string;
  talent_count?: number;
  guest_remarks_count?: number;
  briefing?: string | null;
  allow_talent_portal_apply?: boolean;
  created_at?: string;
  created_by?: string;
  project_manager_id?: string;
  scout_id?: string;
  show_briefing_on_signup?: boolean;
  updated_at?: string;
}

export type SortOption = 'name' | 'project_manager' | 'creation_date' | 'client_remarks';