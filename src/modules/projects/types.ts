export interface Project {
  id: string;
  name: string;
  clientId: string;
  status: 'pending' | 'active' | 'completed';
  startDate: string;
  endDate?: string;
  shotLists: ShotList[];
  tasks: ProjectTask[];
}

export interface ShotList {
  id: string;
  projectId: string;
  name: string;
  locations: Location[];
  equipment: Equipment[];
  shots: Shot[];
  status: 'draft' | 'approved' | 'in_progress' | 'completed';
}

export interface Shot {
  id: string;
  shotListId: string;
  reference: string;
  instructions: string;
  requiredProps: string;
  status: 'pending' | 'confirmed' | 'unavailable';
  additionalNotes?: string;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo: string;
  deadline: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface FileMetadata {
  name: string;
  type: string;
  size: number;
  version: number;
}