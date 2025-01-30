export interface Language {
  id: string;
  language_name: string;
}

export interface ProjectTask {
  id: string;
  language_id: string;
  name: string;
  script_status: 'Pending' | 'In Progress' | 'Approved';
  review_status: 'Internal Review' | 'Client Review' | 'Approved';
  talent_status: 'Booked' | 'Shooting' | 'Delivered' | 'Reshoot' | 'Approved';
  delivery_status: 'Pending' | 'Delivered' | 'R Pending';
  priority?: string;
  created_at: string;
  updated_at?: string;
  language?: Language; // Optional in ProjectTask
}

export interface ProjectItem extends ProjectTask {
  language: Language; // Required in ProjectItem
}