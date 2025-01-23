import React from 'react';
import { toast } from "@/hooks/use-toast";

export interface FeedbackConfig {
  loading?: {
    message: string;
    showSpinner?: boolean;
  };
  success?: {
    message: string;
    duration?: number;
  };
  error?: {
    title?: string;
    retryable?: boolean;
    onRetry?: () => void;
  };
}

export const useFeedback = () => {
  const showLoading = (config: FeedbackConfig['loading']) => {
    return toast({
      title: "Loading",
      description: config.message,
      duration: Infinity,
    });
  };

  const showSuccess = (config: FeedbackConfig['success']) => {
    return toast({
      title: "Success",
      description: config.message,
      duration: config.duration || 3000,
      variant: "default",
    });
  };

  const showError = (error: Error, config?: FeedbackConfig['error']) => {
    return toast({
      title: config?.title || "Error",
      description: error.message,
      variant: "destructive",
      action: config?.retryable && config.onRetry ? {
        label: "Retry",
        onClick: config.onRetry
      } : undefined,
    });
  };

  return {
    showLoading,
    showSuccess,
    showError
  };
};

export interface LoadingStateProps {
  loading: boolean;
  children: React.ReactNode;
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  loading, 
  children, 
  message = 'Loading...' 
}) => {
  if (!loading) {
    return <>{children}</>;
  }
  
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin mr-2">
        <svg
          className="h-5 w-5 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      <span className="text-sm text-muted-foreground">{message}</span>
    </div>
  );
};