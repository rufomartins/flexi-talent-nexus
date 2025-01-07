import { CastingFormData, ValidationErrors, UploadConfig } from '../types/casting';

export const validateCastingForm = (data: CastingFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.name?.trim()) {
    errors.name = 'Casting name is required';
  }

  if (!data.client_id) {
    errors.client_id = 'Client is required';
  }

  if (!data.project_manager_id) {
    errors.project_manager_id = 'Project Manager is required';
  }

  if (!data.talent_briefing?.trim()) {
    errors.talent_briefing = 'Talent briefing is required';
  }

  return errors;
};

export const validateFile = (
  file: File,
  config: UploadConfig
): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!config.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Please upload: ${config.allowedTypes.join(', ')}`
    };
  }

  if (file.size > config.maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${config.maxSize / (1024 * 1024)}MB`
    };
  }

  return { valid: true };
};