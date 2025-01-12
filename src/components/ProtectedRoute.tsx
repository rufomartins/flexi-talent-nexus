import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, userDetails, loading, setUserDetails } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Initializing...");
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!user?.id) {
          console.log("[ProtectedRoute] No user ID available for fetching details");
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
          toast({
            title: "Error",
            description: "Failed to load user details. Please try again.",
            variant: "destructive",
          });
          return;
        }

        if (userData) {
          console.log("[ProtectedRoute] User details fetched successfully:", userData);
          setUserDetails(userData);
        } else {
          console.log("[ProtectedRoute] No user details found");
        }
      } catch (error) {
        console.error("[ProtectedRoute] Exception in fetchUserDetails:", error);
      }
    };

    const initRoute = async () => {
      try {
        console.log("[ProtectedRoute] InitRoute - Current state:", { loading, user, userDetails });
        
        // Set a timeout to prevent infinite loading
        const timeout = setTimeout(() => {
          console.warn("[ProtectedRoute] Loading timeout reached, forcing state update");
          setIsLoading(false);
          setLoadingMessage("Loading timeout reached. Please refresh the page.");
        }, 10000); // 10 second timeout
        
        setLoadingTimeout(timeout);

        if (!loading) {
          if (!user) {
            console.log("[ProtectedRoute] No authenticated user, redirecting to login");
            navigate("/login");
            return;
          }

          if (!userDetails && user) {
            console.log("[ProtectedRoute] User found but no details, fetching details...");
            await fetchUserDetails();
          }

          if (allowedRoles && userDetails) {
            setLoadingMessage("Verifying permissions...");
            console.log("[ProtectedRoute] Checking role access:", {
              userRole: userDetails.role,
              allowedRoles,
            });
            
            if (!allowedRoles.includes(userDetails.role)) {
              console.log("[ProtectedRoute] User does not have required role, redirecting to dashboard");
              toast({
                title: "Access Denied",
                description: "You don't have permission to access this page.",
                variant: "destructive",
              });
              navigate("/dashboard");
              return;
            }
          }
          
          console.log("[ProtectedRoute] Route initialization complete");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("[ProtectedRoute] Error in initRoute:", error);
        toast({
          title: "Error",
          description: "An error occurred while initializing the route.",
          variant: "destructive",
        });
      }
    };

    initRoute();

    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [user, loading, navigate, allowedRoles, userDetails, setUserDetails, loadingTimeout]);

  if (loading || isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm text-muted-foreground">{loadingMessage}</p>
        {loading && <p className="text-xs text-muted-foreground">Waiting for authentication...</p>}
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;