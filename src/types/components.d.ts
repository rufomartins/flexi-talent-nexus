import { CSSProperties } from "react";

export interface BaseComponentProps {
  className?: string;
  style?: CSSProperties;
}

export type ValidationState = 'valid' | 'invalid' | 'warning';

export interface FormFieldProps extends BaseComponentProps {
  label?: string;
  error?: string;
  validation?: ValidationState;
  hint?: string;
}