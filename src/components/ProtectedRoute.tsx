import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Loader2 } from "lucide-react";

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

    // For development/preview purposes: show content after 2 seconds
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [user, loading, navigate]);

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