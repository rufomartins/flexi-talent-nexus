import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, userDetails, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      console.log("No authenticated user found, redirecting to login");
      navigate("/login");
      return;
    }

    // If we need to check roles but don't have user details yet, wait
    if (!loading && user && allowedRoles && !userDetails) {
      console.log("Waiting for user details to check roles");
      return;
    }

    // If we have user details and roles to check, verify authorization
    if (!loading && user && userDetails && allowedRoles) {
      if (!allowedRoles.includes(userDetails.role)) {
        console.log("User role not authorized, redirecting to dashboard");
        navigate("/dashboard");
      }
    }
  }, [user, userDetails, loading, navigate, allowedRoles]);

  // Show loading state only when necessary
  if (loading || (allowedRoles && !userDetails)) {
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

  // Render children only when all checks pass
  return <>{children}</>;
};

export default ProtectedRoute;