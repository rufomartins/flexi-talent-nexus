import { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ProjectErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Project error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Something went wrong loading the project. Please try refreshing the page.
            {this.state.error && (
              <pre className="mt-2 text-sm">
                {this.state.error.message}
              </pre>
            )}
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}