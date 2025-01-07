import type { Database } from "@/integrations/supabase/types";

type ProjectScriptStatus = Database["public"]["Enums"]["project_script_status"];
type ProjectReviewStatus = Database["public"]["Enums"]["project_review_status"];
type ProjectTalentStatus = Database["public"]["Enums"]["project_talent_status"];
type ProjectDeliveryStatus = Database["public"]["Enums"]["project_delivery_status"];
type ProjectTranslationStatus = Database["public"]["Enums"]["project_translation_status"];

export interface Task {
  id: string;
  name: string;
  script_status: ProjectScriptStatus;
  translation_status: ProjectTranslationStatus;
  review_status: ProjectReviewStatus;
  talent_status: ProjectTalentStatus;
  delivery_status: ProjectDeliveryStatus;
}

export interface Language {
  id: string;
  language_name: string;
  tasks: Task[];
}

export interface Country {
  id: string;
  country_name: string;
  languages: Language[];
}

export interface Project {
  id: string;
  name: string;
  countries: Country[];
}

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