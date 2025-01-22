import { DateRange } from "react-day-picker";

export type ProjectStatus = 'pending' | 'active' | 'completed' | 'cancelled';
export type ProjectCategory = 'translation' | 'review' | 'ugc' | 'voice_over';

export interface FilterState {
  dateRange: DateRange | undefined;
  status: ProjectStatus[];
  search: string;
  category: ProjectCategory[];
  projectManagers: string[];
  countries: string[];
  scriptStatus?: string;
  reviewStatus?: string;
  talentStatus?: string;
}

export interface FilterContextType {
  filters: FilterState;
  updateFilter: (key: keyof FilterState, value: any) => void;
}

export interface FilterProps {
  onChange?: (filters: FilterState) => void;
  onApplyFilters?: (filters: Partial<FilterState>) => void;
  onClose?: () => void;
  initialFilters?: Partial<FilterState>;
  children?: React.ReactNode;
}

export interface FilterComponentProps<T> {
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export type ProjectFilters = Partial<FilterState>;