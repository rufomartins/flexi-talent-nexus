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
    // Only redirect if we're sure there's no user (loading is complete)
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    // Check role restrictions only after we have both user and userDetails
    if (!loading && user && userDetails && allowedRoles) {
      if (!allowedRoles.includes(userDetails.role)) {
        navigate("/dashboard");
      }
    }
  }, [user, userDetails, loading, navigate, allowedRoles]);

  // Show loading state only during initial authentication check
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If we're not loading and have no user, return null (useEffect will handle redirect)
  if (!user) {
    return null;
  }

  // If we need to check roles but don't have userDetails yet, show loading
  if (allowedRoles && !userDetails) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;