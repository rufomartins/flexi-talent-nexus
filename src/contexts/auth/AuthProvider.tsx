import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useAuthSession } from "./useAuthSession";
import { useUserDetails } from "./useUserDetails";
import { useAuthActions } from "./useAuthActions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log("[AuthProvider] Initializing provider");
  
  const navigate = useNavigate();
  const [retryCount, setRetryCount] = useState(0);
  const [initializationError, setInitializationError] = useState<Error | null>(null);
  
  const { 
    session, 
    user, 
    loading: sessionLoading, 
    setSession, 
    setUser, 
    setLoading 
  } = useAuthSession();
  
  const { userDetails, setUserDetails, fetchUserDetails } = useUserDetails();
  
  const { signIn, signOut } = useAuthActions(
    setLoading,
    setSession,
    setUser,
    setUserDetails,
    fetchUserDetails
  );

  const retryFetchSession = async () => {
    try {
      console.log(`[AuthProvider] Retrying session fetch attempt ${retryCount + 1}/${MAX_RETRIES}`);
      const { data: { session: newSession }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (newSession) {
        console.log("[AuthProvider] Session retrieved successfully on retry");
        setSession?.(newSession);
        setUser?.(newSession.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("[AuthProvider] Error during retry:", error);
      return false;
    }
  };

  useEffect(() => {
    console.log("[AuthProvider] Setting up auth state listener");
    let mounted = true;
    let retryTimeout: NodeJS.Timeout;
    
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (mounted) {
          if (initialSession) {
            console.log("[AuthProvider] Initial session found:", {
              userId: initialSession.user.id,
              email: initialSession.user.email
            });
            setSession?.(initialSession);
            setUser?.(initialSession.user);
            
            const details = await fetchUserDetails(initialSession.user.id);
            if (details) {
              console.log("[AuthProvider] User details loaded:", details);
              setUserDetails(details);
            }
          } else {
            console.log("[AuthProvider] No initial session found");
          }
          setLoading?.(false);
        }
      } catch (error) {
        console.error("[AuthProvider] Error during initialization:", error);
        
        if (retryCount < MAX_RETRIES) {
          retryTimeout = setTimeout(async () => {
            setRetryCount(prev => prev + 1);
            const success = await retryFetchSession();
            if (!success && mounted) {
              setInitializationError(error as Error);
              toast({
                title: "Authentication Error",
                description: "Failed to initialize session. Please refresh the page.",
                variant: "destructive",
              });
            }
          }, RETRY_DELAY);
        } else {
          setInitializationError(error as Error);
          setLoading?.(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[AuthProvider] Auth state changed:", event, session ? "Has session" : "No session");
      console.log("[AuthProvider] Current mounted state:", mounted);

      if (!mounted) {
        console.log("[AuthProvider] Component unmounted, skipping state updates");
        return;
      }

      if (session?.user) {
        console.log("[AuthProvider] Setting session and user state");
        setSession?.(session);
        setUser?.(session.user);
        
        const details = await fetchUserDetails(session.user.id);
        if (details) {
          console.log("[AuthProvider] Updated user details after state change:", details);
          setUserDetails(details);
        } else {
          console.error("[AuthProvider] Failed to fetch user details after state change");
        }
      } else {
        console.log("[AuthProvider] Clearing session and user state");
        setSession?.(null);
        setUser?.(null);
        setUserDetails(null);
        if (event === "SIGNED_OUT") {
          console.log("[AuthProvider] User signed out, redirecting to login");
          navigate("/login", { replace: true });
        }
      }
      
      if (mounted) {
        console.log("[AuthProvider] Setting loading state to false");
        setLoading?.(false);
      }
    });

    initializeAuth();

    return () => {
      console.log("[AuthProvider] Cleaning up auth state subscription");
      mounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
      subscription.unsubscribe();
    };
  }, [navigate, setLoading, setSession, setUser, setUserDetails, fetchUserDetails, retryCount]);

  console.log("[AuthProvider] Rendering with context:", {
    hasSession: !!session,
    hasUser: !!user,
    hasUserDetails: !!userDetails,
    isLoading: sessionLoading,
    retryCount,
    hasError: !!initializationError
  });

  if (initializationError && !sessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-red-600">Authentication Error</h2>
          <p className="text-gray-600">Failed to initialize session. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (sessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">
          {retryCount > 0 ? `Retrying connection (${retryCount}/${MAX_RETRIES})...` : 'Initializing...'}
        </p>
      </div>
    );
  }

  const contextValue = {
    session,
    user,
    userDetails,
    setUserDetails,
    signIn,
    signOut,
    loading: sessionLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}