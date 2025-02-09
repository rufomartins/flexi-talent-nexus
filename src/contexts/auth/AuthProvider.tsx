
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useSessionManagement } from "@/hooks/auth/useSessionManagement";
import { useUserManagement } from "@/hooks/auth/useUserManagement";
import { useAuthActions } from "@/hooks/auth/useAuthActions";
import { Loader2 } from "lucide-react";

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/onboarding/welcome',
  '/onboarding/welcome-video',
  '/onboarding/chatbot',
  '/onboarding/schedule',
  '/login'
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    session, 
    user, 
    loading: sessionLoading, 
    error,
    setSession, 
    setUser, 
    setLoading,
    setError 
  } = useSessionManagement();
  
  const { userDetails, setUserDetails, fetchUserDetails } = useUserManagement();
  
  const { signIn, signOut } = useAuthActions({
    setLoading,
    setSession,
    setUser,
    setUserDetails,
    setError,
    fetchUserDetails
  });

  // Check if current route is public
  const isPublicRoute = () => {
    return PUBLIC_ROUTES.some(route => location.pathname.startsWith(route));
  };

  // Show loader only for protected routes during session check
  if (sessionLoading && !isPublicRoute()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">
          Initializing...
        </p>
      </div>
    );
  }

  // For public routes, render children immediately
  if (isPublicRoute()) {
    console.log("[AuthProvider] Rendering public route:", location.pathname);
    return <>{children}</>;
  }

  return (
    <AuthContext.Provider 
      value={{
        session,
        user,
        userDetails,
        setUserDetails,
        signIn,
        signOut,
        loading: sessionLoading,
        error,
        setSession,
        setUser,
        setLoading,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
