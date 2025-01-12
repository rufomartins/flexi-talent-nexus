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

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!user?.id) {
          console.log("No user ID available for fetching details");
          return;
        }

        setLoadingMessage("Fetching user details...");
        console.log("Fetching user details for:", user.id);
        
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (userError) {
          console.error("Error fetching user details:", userError);
          toast({
            title: "Error",
            description: "Failed to load user details. Please try again.",
            variant: "destructive",
          });
          return;
        }

        if (userData) {
          console.log("User details fetched successfully:", userData);
          setUserDetails(userData);
        } else {
          console.log("No user details found");
        }
      } catch (error) {
        console.error("Exception in fetchUserDetails:", error);
      }
    };

    const initRoute = async () => {
      try {
        console.log("InitRoute - Current state:", { loading, user, userDetails });
        
        if (!loading) {
          if (!user) {
            console.log("No authenticated user, redirecting to login");
            navigate("/login");
            return;
          }

          if (!userDetails && user) {
            console.log("User found but no details, fetching details...");
            await fetchUserDetails();
          }

          if (allowedRoles && userDetails) {
            setLoadingMessage("Verifying permissions...");
            console.log("Checking role access:", {
              userRole: userDetails.role,
              allowedRoles,
            });
            
            if (!allowedRoles.includes(userDetails.role)) {
              console.log("User does not have required role, redirecting to dashboard");
              toast({
                title: "Access Denied",
                description: "You don't have permission to access this page.",
                variant: "destructive",
              });
              navigate("/dashboard");
              return;
            }
          }
          
          console.log("Route initialization complete");
          setIsLoading(false);
        } else {
          console.log("Auth context still loading...");
        }
      } catch (error) {
        console.error("Error in initRoute:", error);
        toast({
          title: "Error",
          description: "An error occurred while initializing the route.",
          variant: "destructive",
        });
      } finally {
        if (!loading) {
          setIsLoading(false);
        }
      }
    };

    initRoute();
  }, [user, loading, navigate, allowedRoles, userDetails, setUserDetails]);

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