export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
  communication_status?: 'email_sent' | 'sms_sent' | 'no_response';
  scout?: {
    id: string;
    full_name: string;
  };
}