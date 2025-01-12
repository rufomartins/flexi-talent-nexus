import { BaseRecord } from './base';
import { TalentProfile } from './talent';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking extends BaseRecord {
  casting_id: string;
  created_by: string;
  details: string;
  email_template_id: string;
  start_date: string;
  end_date: string;
  final_fee: number;
  talent_fee: number;
  payment_status: string;
  project_id: string;
  status: BookingStatus;
  talent_profiles: TalentProfile;
  projects?: {
    name: string;
    description: string;
  };
  booking_files?: Array<{
    id: string;
    file_name: string;
    file_type: string;
    file_path: string;
    created_at: string;
  }>;
}