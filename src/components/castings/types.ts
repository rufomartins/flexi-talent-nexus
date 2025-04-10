
export type SortOption = 'name' | 'project_manager' | 'creation_date' | 'client_remarks' | string;

export interface Casting {
  id: string;
  name: string;
  description: string;
  status: 'open' | 'closed';
  logo_url?: string;
  banner_url?: string;
  talent_count?: number;
  guest_remarks_count?: number;
  created_at: string;
  updated_at: string;
  client_id?: string;
  project_manager_id?: string;
  talent_briefing?: string;
  client?: {
    id: string;
    full_name: string;
  };
  project_manager?: {
    id: string;
    full_name: string;
  };
}
