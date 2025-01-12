import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, userDetails, loading } = useAuth();
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      console.log("No authenticated user found, redirecting to login");
      navigate("/login");
      return;
    }

    // Check role access if allowedRoles is specified
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

    // For development/preview purposes: show content after a short delay
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, loading, navigate, allowedRoles, userDetails]);

  // Show loading state only when necessary and not timed out
  if (!showContent && (loading || (allowedRoles && !userDetails))) {
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