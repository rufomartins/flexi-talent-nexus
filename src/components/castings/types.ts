export type CastingStatus = 'open' | 'closed';
export type CastingType = 'internal' | 'external';

export interface CastingClient {
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
  description?: string;
  talent_count?: number;
  guest_remarks_count?: number;
  project_manager?: {
    full_name: string | null;
  } | null;
}

export type SortOption = 'name' | 'project_manager' | 'creation_date' | 'client_remarks';