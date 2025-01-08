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

export interface EquipmentFormData {
  equipment_type: string;
  specifications?: string;
  required_shots?: string[];
  notes?: string;
}