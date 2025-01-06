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
    console.log("ProtectedRoute state:", { 
      loading, 
      hasUser: !!user, 
      hasUserDetails: !!userDetails,
      allowedRoles 
    });

    if (!loading && !user) {
      console.log("No user found after loading, redirecting to login");
      navigate("/login");
      return;
    }

    if (!loading && user && userDetails && allowedRoles) {
      if (!allowedRoles.includes(userDetails.role)) {
        console.log("User role not allowed, redirecting to dashboard");
        navigate("/dashboard");
      }
    }
  }, [user, userDetails, loading, navigate, allowedRoles]);

  if (loading) {
    console.log("Showing loading state");
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    console.log("No user, returning null");
    return null;
  }

  if (allowedRoles && !userDetails) {
    console.log("Waiting for user details");
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  console.log("Rendering protected content");
  return <>{children}</>;
};

export default ProtectedRoute;