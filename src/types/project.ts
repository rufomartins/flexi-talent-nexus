
export type ProjectStatus = 'active' | 'completed' | 'on_hold';

export type ProjectScriptStatus = 'Pending' | 'In Progress' | 'Approved';
export type ProjectReviewStatus = 'Internal Review' | 'Client Review' | 'Approved';
export type ProjectTalentStatus = 'Booked' | 'Shooting' | 'Delivered' | 'Reshoot' | 'Approved';
export type ProjectDeliveryStatus = 'Pending' | 'Delivered' | 'R Pending';

export interface Client {
  id: string;
  name: string;
}

export interface ProjectCountry {
  id: string;
  country_name: string;
  languages: ProjectLanguage[];
}

export interface ProjectLanguage {
  id: string;
  language_name: string;
  tasks?: ProjectTask[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  client_id?: string;
  project_manager_id?: string;
  start_date?: string;
  end_date?: string;
  status: ProjectStatus;
  type?: string;
  completion_percentage?: number;
  active_tasks_count?: number;
  upcoming_deadlines_count?: number;
  client?: {
    id: string;
    name: string;
  };
  project_manager?: {
    full_name: string;
  };
  created_at: string;
  updated_at: string;
  countries?: ProjectCountry[];
}

export interface ProjectTask {
  id: string;
  language_id: string;
  name: string;
  script_status: ProjectScriptStatus;
  review_status: ProjectReviewStatus;
  talent_status: ProjectTalentStatus;
  delivery_status: ProjectDeliveryStatus;
  priority: string;
  created_at: string;
  updated_at?: string;
}

export interface ShotList {
  id?: string;
  task_id: string;
  name: string;
  shared_with?: any;
  version?: number;
  created_at?: string;
  updated_at?: string;
}
