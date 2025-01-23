import type { Json } from '@/integrations/supabase/types';

export type ProjectStatusType = 'notified' | 'working' | 'reshooting' | 'approved';

export const PROJECT_STATUS_COLORS = {
  notified: 'bg-red-500',
  working: 'bg-blue-500',
  reshooting: 'bg-yellow-500',
  approved: 'bg-green-500'
} as const;

export interface ProjectProgress {
  totalTasks: number;
  completedTasks: number;
  status: ProjectStatusType;
  lastUpdate: string;
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

export interface ProjectRecord {
  id?: string;
  name: string;
  created_at?: string;
  updated_at?: string;
  task_id?: string;
  template_id?: string;
  shared_with?: Json;
  version?: number;
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