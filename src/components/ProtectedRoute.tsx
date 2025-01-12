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

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        console.log("Fetching user details for:", user?.id);
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user?.id)
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
          console.log("User details fetched:", userData);
          setUserDetails(userData);
        }
      } catch (error) {
        console.error("Exception in fetchUserDetails:", error);
      }
    };

    const initRoute = async () => {
      if (!loading) {
        if (!user) {
          console.log("No authenticated user, redirecting to login");
          navigate("/login");
          setIsLoading(false);
          return;
        }

        if (!userDetails && user) {
          console.log("User found but no details, fetching details...");
          await fetchUserDetails();
        }

        if (allowedRoles && userDetails) {
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

        setIsLoading(false);
      }
    };

    initRoute();
  }, [user, loading, navigate, allowedRoles, userDetails, setUserDetails]);

  if (loading || isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;