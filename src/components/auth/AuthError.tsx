import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface AuthErrorProps {
  error: string;
  onRetry: () => void;
  debugInfo?: any;
  showDebugInfo?: boolean;
}

export const AuthError = ({ 
  error, 
  onRetry, 
  debugInfo, 
  showDebugInfo = false 
}: AuthErrorProps) => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-4 p-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
      
      <Button 
        onClick={onRetry}
        variant="outline"
        className="gap-2"
      >
        <RefreshCcw className="h-4 w-4" />
        Retry
      </Button>

      {showDebugInfo && debugInfo && (
        <Alert className="max-w-md mt-4">
          <AlertTitle>Super Admin Debug Info</AlertTitle>
          <AlertDescription className="text-xs">
            <pre className="mt-2 whitespace-pre-wrap">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};