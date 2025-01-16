import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Loader2, AlertTriangle, RefreshCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, userDetails, loading, setUserDetails } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Initializing...");
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const MAX_RETRIES = 3;

  const handleRetry = () => {
    setError(null);
    setRetryCount(0);
    setIsLoading(true);
    // This will trigger the useEffect to run again
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!user?.id) {
          console.log("[ProtectedRoute] No user ID available for fetching details");
          return;
        }

        if (userDetails) {
          console.log("[ProtectedRoute] User details already loaded:", userDetails);
          return;
        }

        setLoadingMessage("Fetching user details...");
        console.log("[ProtectedRoute] Fetching user details for:", user.id);
        
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (userError) {
          console.error("[ProtectedRoute] Error fetching user details:", userError);
          if (retryCount < MAX_RETRIES) {
            setRetryCount(prev => prev + 1);
            return;
          }
          throw new Error("Failed to load user details. Please try again.");
        }

        if (userData) {
          console.log("[ProtectedRoute] User details fetched successfully:", userData);
          setUserDetails(userData);
          setRetryCount(0);
          setError(null);
        } else {
          // Fallback to user metadata if available
          if (user.user_metadata?.role) {
            console.log("[ProtectedRoute] Using role from metadata:", user.user_metadata.role);
            setUserDetails({
              id: user.id,
              role: user.user_metadata.role,
              full_name: user.user_metadata.full_name || user.email,
              status: 'active'
            });
            setError(null);
          } else {
            setError("Unable to load user profile. Please contact support.");
          }
        }
      } catch (error) {
        console.error("[ProtectedRoute] Exception in fetchUserDetails:", error);
        setError(error instanceof Error ? error.message : "An unexpected error occurred");
      }
    };

    const initRoute = async () => {
      try {
        if (loading) {
          console.log("[ProtectedRoute] Still loading auth state...");
          return;
        }

        if (!user) {
          console.log("[ProtectedRoute] No authenticated user, redirecting to login");
          navigate("/login");
          setIsLoading(false);
          return;
        }

        if (!userDetails) {
          await fetchUserDetails();
          return;
        }

        if (allowedRoles && userDetails) {
          setLoadingMessage("Verifying permissions...");
          console.log("[ProtectedRoute] Checking role access:", {
            userRole: userDetails.role,
            allowedRoles,
          });
          
          if (!allowedRoles.includes(userDetails.role)) {
            toast({
              title: "Access Denied",
              description: "You don't have permission to access this page.",
              variant: "destructive",
            });
            navigate("/dashboard");
            return;
          }
        }
        
        setIsLoading(false);
        setError(null);
      } catch (error) {
        setError("An error occurred while initializing the route.");
        setIsLoading(false);
      }
    };

    initRoute();
  }, [user, loading, userDetails, retryCount]);

  if (loading || isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm text-muted-foreground">{loadingMessage}</p>
        {retryCount > 0 && (
          <p className="text-xs text-muted-foreground">
            Retry attempt {retryCount}/{MAX_RETRIES}...
          </p>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-4 p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          onClick={handleRetry}
          variant="outline"
          className="gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Retry
        </Button>
        {user?.email === 'cmartins@gtmd.studio' && (
          <Alert className="max-w-md mt-4">
            <AlertTitle>Super Admin Debug Info</AlertTitle>
            <AlertDescription className="text-xs">
              <pre className="mt-2 whitespace-pre-wrap">
                {JSON.stringify({ user, userDetails, retryCount }, null, 2)}
              </pre>
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;