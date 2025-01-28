export interface Language {
  id: string;
  language_name: string;
  country_id: string;
}

export interface Country {
  id: string;
  country_name: string;
  languages: Language[];
}

export interface Project {
  id: string;
  name: string;
  client_id?: string;
  project_manager_id?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  type?: string;
  created_at: string;
  updated_at: string;
  description?: string;
  completion_percentage?: number;
  active_tasks_count?: number;
  upcoming_deadlines_count?: number;
  progress_percentage?: number;
  color_code?: string;
  countries?: Country[];
}