import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
}

export const RouteErrorBoundary: React.FC<RouteErrorBoundaryProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      event.preventDefault();
      setError(event.error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription className="mt-2">
            {error?.message || 'An unexpected error occurred'}
          </AlertDescription>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setHasError(false);
              setError(null);
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </Alert>
      </div>
    );
  }

  return children;
};