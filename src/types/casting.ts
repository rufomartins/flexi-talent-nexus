export type CastingStatus = 'open' | 'closed';
export type CastingType = 'internal' | 'external';

export interface Client {
  id: string;
  name: string;
  created_at: string;
}

export interface FileUpload {
  file: File | null;
  preview: string | null;
  error?: string;
}

export interface CastingFormData {
  name: string;
  client_id: string | null;
  project_manager_id: string | null;
  talent_briefing: string;
  show_briefing: boolean;
  allow_talent_portal: boolean;
  description: string;
  status: CastingStatus;
  casting_type: CastingType;
}

export interface ValidationErrors {
  name?: string;
  client_id?: string;
  project_manager_id?: string;
  talent_briefing?: string;
  logo?: string;
  banner?: string;
  general?: string;
}

export interface UploadConfig {
  maxSize: number;
  allowedTypes: string[];
  path: string;
}

export const FILE_CONFIG: Record<string, UploadConfig> = {
  logo: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
    path: 'logos'
  },
  banner: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
    path: 'banners'
  }
};