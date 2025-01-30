export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'emailed' | 'interviewed' | 'approved' | 'not_interested';
  stage: 'ingest' | 'process' | 'screening' | 'results';
  created_at: string;
  communication_status?: 'email_sent' | 'sms_sent' | 'no_response';
  scout?: {
    id: string;
    full_name: string;
  };
}