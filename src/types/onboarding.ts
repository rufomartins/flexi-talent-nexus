export interface Candidate {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: 'new' | 'emailed' | 'interviewed' | 'approved' | 'not_interested';
  stage: 'ingest' | 'process' | 'screening' | 'results';
  language: string;
  native_language: string;
  source: string;
  remarks: string;
  scout: {
    id: string;
    full_name: string;
  } | null;
  communication_status?: string;
  created_at?: string;
  updated_at?: string;
  archive_status?: boolean;
  date_added_to_screening?: string;
  last_activity_date?: string;
  interview_date?: string;
  chatbot_status?: string;
}

export interface CandidateTableProps {
  candidates: Candidate[];
  selectedCandidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onSelectAll: (checked: boolean) => void;
  stage: 'ingest' | 'process' | 'screening' | 'results';
  getStatusColor: (status: string) => string;
}

export type TemplateType = 'welcome' | 'interview_scheduled' | 'interview_reminder' | 'approval' | 'rejection';

export interface OnboardingEmailTemplate {
  id: string;
  name: string;
  type: TemplateType;
  subject: string;
  body: string;
  variables: string[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface SmsTemplate {
  id: string;
  name: string;
  type: TemplateType;
  message: string;
  variables: string[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EmailSenderConfig {
  id: string;
  stage: string;
  sender_email: string;
  is_active: boolean;
  enable_receiving: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ApiSettings {
  id: string;
  name: string;
  value: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface CandidateActionsProps {
  candidateId: string;
  candidateName: string;
  email: string;
  phone?: string;
  stage?: 'ingest' | 'process' | 'screening' | 'results';
}

export interface ExcelRowData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  language?: string;
  native_language?: string;
  source?: string;
  remarks?: string;
}

export type Step = 'compose' | 'preview' | 'send';

export interface EmailAndSmsComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCandidates: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
  }[];
  candidateId?: string;
  candidateName?: string;
  email?: string;
  phone?: string;
  stage?: 'ingest' | 'process' | 'screening' | 'results';
}

export interface EmailComposerProps {
  templates: OnboardingEmailTemplate[];
  data: {
    templateId: string;
    subject: string;
    body: string;
  };
  onChange: (data: { templateId: string; subject: string; body: string }) => void;
  onInsertTag: (tag: string) => void;
}

export interface SmsComposerProps {
  data: {
    templateId: string;
    message: string;
  };
  onChange: (data: { templateId: string; message: string }) => void;
  onInsertTag: (tag: string) => void;
}

export interface EmailTemplate {
  id: string;
  name: string;
  type: TemplateType;
  subject: string;
  body: string;
  variables: string[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface CandidateFiltersProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  languageFilter: string;
  onLanguageFilterChange: (value: string) => void;
}