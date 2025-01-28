import type { Database } from "@/integrations/supabase/types";

type ProjectScriptStatus = Database["public"]["Enums"]["project_script_status"];
type ProjectReviewStatus = Database["public"]["Enums"]["project_review_status"];
type ProjectTalentStatus = Database["public"]["Enums"]["project_talent_status"];
type ProjectDeliveryStatus = Database["public"]["Enums"]["project_delivery_status"];

export interface ProjectFilters {
  projectManager?: string;
  country?: string;
  language?: string;
  scriptStatus?: ProjectScriptStatus;
  reviewStatus?: ProjectReviewStatus;
  talentStatus?: ProjectTalentStatus;
  startDate?: Date;
  endDate?: Date;
}

export interface ProjectItem {
  id: string;
  language_id: string;
  name: string;
  script_status: ProjectScriptStatus;
  review_status: ProjectReviewStatus;
  talent_status: ProjectTalentStatus;
  delivery_status: ProjectDeliveryStatus;
  priority: string;
  created_at: string;
}

export interface Language {
  id: string;
  language_name: string;
  country_id: string;
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
  status?: string;
  type?: string;
  completion_percentage?: number;
  active_tasks_count?: number;
  upcoming_deadlines_count?: number;
  client?: {
    name: string;
  };
  project_manager?: {
    full_name: string;
  };
  countries?: Country[];
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
  priority?: string;
  created_at?: string;
  updated_at?: string;
}