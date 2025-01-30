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
}

export interface ExcelRowData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  language: string;
  native_language: string;
  source?: string;
  remarks?: string;
}

export interface CandidateTableProps {
  candidates: Candidate[];
  selectedCandidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onSelectAll: (checked: boolean) => void;
  stage: 'ingest' | 'process' | 'screening' | 'results';
  getStatusColor: (status: string) => string;
}

export interface CandidateActionsProps {
  candidateId: string;
  candidateName: string;
  email?: string;
  phone?: string;
  stage: 'ingest' | 'process' | 'screening' | 'results';
}