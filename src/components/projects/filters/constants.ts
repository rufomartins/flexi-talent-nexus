import { ProjectStatus, ProjectCategory } from "./types";

export const PROJECT_STATUSES: ProjectStatus[] = [
  'pending',
  'active',
  'completed',
  'cancelled'
];

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  'translation',
  'review',
  'ugc',
  'voice_over'
];