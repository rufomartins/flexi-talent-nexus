import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { LoadingState } from "./LoadingState";
import { AuthError } from "./AuthError";
import { supabase } from "@/integrations/supabase/client";

interface AuthenticationGuardProps {
  children: React.ReactNode;
}

export const AuthenticationGuard = ({ children }: AuthenticationGuardProps) => {
  const navigate = useNavigate();
  const { user, userDetails, loading, setUserDetails } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Initializing...");
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const MAX_RETRIES = 3;

  const handleRetry = () => {
    console.log("[AuthenticationGuard] Retrying initialization");
    setError(null);
    setRetryCount(0);
    setIsLoading(true);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!user?.id) {
          console.log("[AuthenticationGuard] No user ID available");
          return;
        }

        if (userDetails) {
          console.log("[AuthenticationGuard] User details already loaded:", {
            id: userDetails.id,
            role: userDetails.role
          });
          return;
        }

        setLoadingMessage("Fetching user details...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.error("[AuthenticationGuard] No active session");
          throw new Error("No active session");
        }

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (userError) {
          console.error("[AuthenticationGuard] Error fetching user details:", userError);
          throw userError;
        }

        if (userData) {
          setUserDetails(userData);
          setRetryCount(0);
          setError(null);
        } else {
          throw new Error("Unable to load user profile");
        }
      } catch (error) {
        console.error("[AuthenticationGuard] Error:", error);
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
        } else {
          setError(error instanceof Error ? error.message : "An unexpected error occurred");
        }
      }
    };

    if (!loading && !user) {
      navigate("/login");
      setIsLoading(false);
      return;
    }

    if (!loading && user && !userDetails) {
      fetchUserDetails();
    } else {
      setIsLoading(false);
    }
  }, [user, loading, userDetails, retryCount, navigate, setUserDetails]);

  if (loading || isLoading) {
    return (
      <LoadingState 
        message={loadingMessage}
        retryCount={retryCount}
        maxRetries={MAX_RETRIES}
      />
    );
  }

  if (error) {
    return (
      <AuthError 
        error={error}
        onRetry={handleRetry}
        debugInfo={user ? {
          id: user.id,
          email: user.email,
          metadata: user.user_metadata
        } : null}
        showDebugInfo={user?.email === 'cmartins@gtmd.studio'}
      />
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};