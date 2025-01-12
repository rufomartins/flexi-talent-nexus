import { BaseRecord } from './base';

export interface Project extends BaseRecord {
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
  client?: {
    name: string;
  };
}

export interface ProjectItem extends BaseRecord {
  project_id: string;
  title: string;
  language: string;
  country: string;
  status: string;
  talent_id?: string;
  reviewer_id?: string;
  deadline: string;
  item_type: 'script' | 'video' | 'translation' | 'review';
}