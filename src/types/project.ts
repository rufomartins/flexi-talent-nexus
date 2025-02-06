
export type ProjectStatus = 'active' | 'completed' | 'on_hold';

export interface Client {
  id: string;
  name: string;
}

export interface Language {
  id: string;
  language_name: string;
  tasks?: ProjectTask[];
}

export interface Country {
  id: string;
  country_name: string;
  languages: Language[];
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
  client?: Client;  // Add the client property
  project_manager?: {
    full_name: string;
  };
  countries: Country[];
  created_at: string;
  updated_at: string;
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

export interface ProjectItem extends ProjectTask {
  created_at: string;
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
