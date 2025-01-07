export interface Location {
  id: string;
  name: string;
  address?: string | null;
  time_of_day?: string | null;
  special_requirements?: string | null;
  status?: 'Pending' | 'Confirmed' | 'Unavailable';
  shot_list_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Shot {
  id: string;
  shot_list_id: string;
  shot_number: number;
  location_id: string | null;
  description: string | null;
  frame_type: string | null;
  status: 'Pending' | 'In Progress' | 'Completed';
  notes: string | null;
  sequence_order: number;
  created_at: string | null;
  updated_at: string | null;
  location: Location | null;
}