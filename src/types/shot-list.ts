export interface Location {
  id: string;
  name: string;
}

export interface Shot {
  id: string;
  shot_number: number;
  location?: Location | null;
  description?: string | null;
  frame_type?: string | null;
  status: 'Pending' | 'In Progress' | 'Completed';
  notes?: string | null;
}

export interface TalentNote {
  id: string;
  shot_list_id: string | null;
  shot_reference: string | null;
  instructions: string | null;
  required_props: string | null;
  additional_notes: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}