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
  shot_number: number;
  shot_list_id: string | null;
  location_id?: string | null;
  location?: Location | null;
  description?: string | null;
  frame_type?: string | null;
  status: 'Pending' | 'In Progress' | 'Completed';
  notes?: string | null;
  sequence_order: number;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface TalentNote {
  id: string;
  shot_list_id: string | null;
  shot_reference: string | null;
  instructions: string | null;
  required_props: string | null;
  additional_notes: string | null;
  created_at: string | null;
  updated_at: string | null;
}