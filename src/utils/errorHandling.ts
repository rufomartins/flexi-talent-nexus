import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface ErrorConfig {
  showNotification: boolean;
  logToServer: boolean;
  retryable: boolean;
}

export interface AppError extends Error {
  code?: string;
  details?: unknown;
  retryCallback?: () => void;
}

const defaultConfig: ErrorConfig = {
  showNotification: true,
  logToServer: true,
  retryable: false,
};

// Error normalization
const normalizeError = (error: unknown): AppError => {
  if (error instanceof Error) {
    return error as AppError;
  }
  
  return new Error(
    typeof error === 'string' ? error : 'An unexpected error occurred'
  ) as AppError;
};

// Error logging to Supabase
const logError = async (error: AppError) => {
  try {
    const { error: logError } = await supabase
      .from('error_logs')
      .insert({
        message: error.message,
        code: error.code,
        details: error.details,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });

    if (logError) {
      console.error('Failed to log error:', logError);
    }
  } catch (e) {
    console.error('Error logging failed:', e);
  }
};

// Error notifications
const showErrorNotification = (error: AppError) => {
  toast({
    title: "Error",
    description: error.message,
    variant: "destructive",
  });
};

export const errorHandler = {
  handle: async (error: unknown, config: ErrorConfig = defaultConfig): Promise<AppError> => {
    const appError = normalizeError(error);
    
    if (config.showNotification) {
      showErrorNotification(appError);
    }

    if (config.logToServer) {
      await logError(appError);
    }

    return appError;
  }
};

// Hook for error handling
export const useErrorHandler = (feature: string) => {
  const handleError = async (error: unknown, config?: ErrorConfig) => {
    const appError = await errorHandler.handle(error, {
      ...defaultConfig,
      ...config
    });
    appError.details = { feature, ...appError.details as object };
    return appError;
  };

  return { handleError };
};