import { BaseRecord } from './base';

/** Project record from the database */
export interface Project extends BaseRecord {
  name: string;
  description: string;
  client_id?: string;
  project_manager_id?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  type?: string;
  completion_percentage?: number;
  active_tasks_count?: number;
  upcoming_deadlines_count?: number;
}