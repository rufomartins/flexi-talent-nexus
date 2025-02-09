
import { useAuth } from "@/contexts/auth";
import { Navigate, useLocation } from "react-router-dom";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = [
  '/onboarding/welcome',
  '/onboarding/welcome-video',
  '/onboarding/chatbot',
  '/onboarding/schedule',
  '/login'
];

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Check if current route is a public route
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    location.pathname.startsWith(route)
  );
  
  // If route is public, allow access regardless of auth status
  if (isPublicRoute) {
    return <>{children}</>;
  }
  
  // If user is authenticated and route is not public, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
