import type { BaseRecord } from './base';

export type EmailTemplateType = 'casting_availability' | 'booking_confirmation' | 'talent_application' | 'project_update' | 'talent_invitation';

export interface EmailTemplate extends BaseRecord {
  name: string;
  subject: string;
  body: string;
  type: EmailTemplateType;
  variables?: string[];
  is_active: boolean;
  created_by?: string;
}