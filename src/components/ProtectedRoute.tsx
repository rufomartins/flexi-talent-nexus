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
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) return;

      try {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (userError) {
          console.error("Error fetching user details in ProtectedRoute:", userError);
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
        }
      } catch (error) {
        console.error("Exception in ProtectedRoute fetchUserDetails:", error);
      }
    };

    // If not loading and no user, redirect to login
    if (!loading && !user) {
      console.log("No authenticated user found, redirecting to login");
      navigate("/login");
      return;
    }

    // If we have a user but no userDetails, fetch them
    if (user && !userDetails) {
      console.log("User found but no details, fetching details...");
      fetchUserDetails();
    }

    // Check role access if allowedRoles is specified and we have userDetails
    if (!loading && user && allowedRoles && userDetails) {
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

    // Show content after a short delay to prevent flashing
    const timer = setTimeout(() => {
      if (user && userDetails) {
        setShowContent(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [user, loading, navigate, allowedRoles, userDetails, setUserDetails]);

  // Show loading state only when necessary
  if (!showContent && (loading || (user && !userDetails))) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If no user and still loading, return null (let the redirect happen)
  if (!user) {
    return null;
  }

  // Render children when we have content
  return <>{children}</>;
};

export default ProtectedRoute;