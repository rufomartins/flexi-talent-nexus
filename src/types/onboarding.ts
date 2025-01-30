export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'emailed' | 'interviewed' | 'approved' | 'not_interested';
  stage: 'ingest' | 'process' | 'screening' | 'results';
  scout: {
    id: string;
    full_name: string;
  } | null;
  communication_status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ExcelRowData {
  full_name: string;
  public_email: string;
  public_phone?: string;
  followers_count?: number;
  following_count?: number;
  profile_url?: string;
  external_url?: string;
  biography?: string;
  username: string;
}

export interface CandidateStats {
  ingested: number;
  inProcess: number;
  emailsSent: number;
  emailsFailed: number;
  interviewsScheduled: number;
  chatbotConfirmed: number;
  chatbotDeclined: number;
  preScreeningPending: number;
}

export type CandidateStage = 'ingest' | 'process' | 'screening' | 'results';

export interface CandidateAction {
  label: string;
  action: string;
}