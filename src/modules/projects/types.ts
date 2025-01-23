import type { Json } from '@/integrations/supabase/types';

export interface Equipment {
  id: string;
  shot_list_id: string;
  equipment_type: string;
  specifications: string | null;
  required_shots: string[] | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  client_id: string;
  status: 'pending' | 'active' | 'completed';
  start_date: string;
  end_date?: string;
  shot_lists: ShotList[];
  tasks: ProjectTask[];
}

export interface ShotList {
  id: string;
  task_id: string;
  name: string;
  locations: Location[];
  equipment: Equipment[];
  shots: Shot[];
  status: 'draft' | 'approved' | 'in_progress' | 'completed';
  shared_with?: Json;
  version?: number;
  template_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Shot {
  id: string;
  shot_list_id: string;
  reference: string;
  instructions: string;
  required_props: string;
  status: 'pending' | 'confirmed' | 'unavailable';
  additional_notes?: string;
}

export interface ProjectTask {
  id: string;
  language_id: string;
  name: string;
  script_status?: 'Pending' | 'In Progress';
  review_status?: 'Internal Review' | 'Client Review' | 'Approved';
  talent_status?: 'Delivered' | 'Booked' | 'Shooting' | 'Reshoot';
  delivery_status?: 'Pending' | 'Delivered' | 'R Pending';
  priority: 'low' | 'medium' | 'high';
  created_at?: string;
  updated_at?: string;
}

export interface FileMetadata {
  name: string;
  type: string;
  size: number;
  version: number;
}