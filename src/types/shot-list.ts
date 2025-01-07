export interface Location {
  id: string;
  name: string | null;
}

export interface Shot {
  id: string;
  shot_number: number;
  description: string;
  frame_type: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  notes?: string;
  location?: Location | null;
  sequence_order: number;
}

export interface ShotFormData {
  shot_number: number;
  description: string;
  frame_type: string;
  notes?: string;
  location_id?: string;
}