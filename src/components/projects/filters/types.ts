import { DateRange } from "react-day-picker";

export interface ProjectFilters {
  projectManager?: string;
  country?: string;
  language?: string;
  scriptStatus?: string;
  reviewStatus?: string;
  talentStatus?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface FilterProps {
  onApplyFilters: (filters: ProjectFilters) => void;
  onClose: () => void;
  initialFilters?: ProjectFilters;
}

export interface FilterSectionProps {
  label: string;
  children: React.ReactNode;
}