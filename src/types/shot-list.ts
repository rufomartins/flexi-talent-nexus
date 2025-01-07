export interface Shot {
  id: string;
  shot_list_id: string;
  shot_number: number;
  location_id: string | null;
  description: string;
  frame_type: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  notes: string | null;
  sequence_order: number;
  location?: {
    name: string;
  };
}

export interface ShotFormData {
  shot_number: number;
  description: string;
  frame_type: string;
  notes?: string;
  location_id?: string;
}