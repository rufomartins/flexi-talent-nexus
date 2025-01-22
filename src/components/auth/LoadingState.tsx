import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  retryCount?: number;
  maxRetries?: number;
}

export const LoadingState = ({ 
  message = "Initializing...", 
  retryCount = 0, 
  maxRetries = 3 
}: LoadingStateProps) => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="text-sm text-muted-foreground">{message}</p>
      {retryCount > 0 && (
        <p className="text-xs text-muted-foreground">
          Retry attempt {retryCount}/{maxRetries}...
        </p>
      )}
    </div>
  );
};