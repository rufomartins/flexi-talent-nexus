export type FieldType = 
  | 'text'
  | 'long_text'
  | 'email'
  | 'date'
  | 'single_select'
  | 'multi_select'
  | 'number'
  | 'phone'
  | 'blank_space'
  | 'custom_dropdown'
  | 'fixed_dropdown';

export interface TalentProfileField {
  id: string;
  label: string;
  field_type: FieldType;
  tab: string;
  position: number;
  is_active: boolean;
  show_on_signup: boolean;
  is_required: boolean;
  guest_access: boolean;
  advanced_rules?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface FieldOption {
  id: string;
  field_id: string;
  label: string;
  value: string;
  position: number;
  created_at: string;
}