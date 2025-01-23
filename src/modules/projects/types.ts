import type { Json } from '@/integrations/supabase/types';

export type ProjectStatusType = 'Notified' | 'Working' | 'Reshooting' | 'Approved';

export const PROJECT_STATUS_COLORS = {
  Notified: 'bg-red-500',
  Working: 'bg-blue-500',
  Reshooting: 'bg-yellow-500',
  Approved: 'bg-green-500'
} as const;

export interface ProjectProgress {
  totalTasks: number;
  completedTasks: number;
  status: ProjectStatusType;
  lastUpdate: string;
}

export interface FileMetadata {
  name: string;
  type: string;
  size: number;
  version: number;
}

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

export interface ShotList {
  id?: string;
  task_id: string;
  name: string;
  shared_with?: Json;
  version?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectTask {
  id?: string;
  language_id: string;
  name: string;
  script_status: 'Pending' | 'In Progress' | 'Approved';
  review_status: 'Internal Review' | 'Client Review' | 'Approved';
  talent_status: 'Booked' | 'Shooting' | 'Delivered' | 'Reshoot' | 'Approved';
  delivery_status: 'Pending' | 'Delivered' | 'R Pending';
  priority?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  client_id?: string;
  project_manager_id?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  type?: string;
  completion_percentage?: number;
  active_tasks_count?: number;
  upcoming_deadlines_count?: number;
  client?: { name: string };
  project_manager?: { full_name: string };
  created_at: string;
  updated_at: string;
}

export interface ProjectAsset {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  version: number;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}