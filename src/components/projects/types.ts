export type ProjectStatus = 'active' | 'completed' | 'on_hold';
export type ScriptStatus = 'In Progress' | 'Pending' | 'Approved';
export type ReviewStatus = 'Internal Review' | 'Client Review' | 'Approved';
export type TalentStatus = 'Booked' | 'Shooting' | 'Delivered' | 'Reshoot' | 'Approved';
export type DeliveryStatus = 'Pending' | 'Delivered' | 'R Pending';

export interface Client {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  client_id?: string;
  client?: Client;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface ProjectItem {
  id: string;
  language_id: string;
  name: string;
  script_status: ScriptStatus;
  review_status: ReviewStatus;
  talent_status: TalentStatus;
  delivery_status: DeliveryStatus;
  priority: string;
  created_at: string;
}