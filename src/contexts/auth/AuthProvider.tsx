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
const RETRY_DELAY = 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
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

  // Initialize auth state
  useEffect(() => {
    let mounted = true;
    let retryTimeout: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        console.info("[Auth] Starting auth initialization...");
        
        // Clear any stale data first
        localStorage.clear();
        sessionStorage.clear();
        
        // Get initial session with retry logic
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("[AuthProvider] Session error:", sessionError);
          throw sessionError;
        }

        if (!mounted) {
          console.log("[AuthProvider] Component unmounted during initialization");
          return;
        }

        if (initialSession) {
          console.log("[AuthProvider] Initial session found:", {
            userId: initialSession.user.id,
            email: initialSession.user.email,
            metadata: initialSession.user.user_metadata
          });
          
          setSession?.(initialSession);
          setUser?.(initialSession.user);
          
          // Fetch user details after session is confirmed
          try {
            const details = await fetchUserDetails(initialSession.user.id);
            if (details && mounted) {
              console.log("[AuthProvider] User details loaded:", details);
              setUserDetails(details);
              navigate("/dashboard");
            }
          } catch (detailsError) {
            console.error("[AuthProvider] Error fetching user details:", detailsError);
            if (mounted) {
              navigate("/login");
            }
          }
        } else {
          console.log("[AuthProvider] No initial session");
          if (mounted) {
            navigate("/login");
          }
        }
        
        if (mounted) {
          setLoading?.(false);
        }
      } catch (error) {
        console.error("[AuthProvider] Initialization error:", error);
        
        if (retryCount < MAX_RETRIES && mounted) {
          console.log(`[AuthProvider] Retrying initialization (${retryCount + 1}/${MAX_RETRIES})`);
          retryTimeout = setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, RETRY_DELAY);
        } else if (mounted) {
          setInitializationError(error as Error);
          setLoading?.(false);
          navigate("/login");
          toast({
            title: "Authentication Error",
            description: "Failed to initialize session. Please try again.",
            variant: "destructive",
          });
        }
      }
    };

    // Set up auth state subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[AuthProvider] Auth state changed:", event, session?.user?.email);

      if (!mounted) return;

      if (session?.user) {
        setSession?.(session);
        setUser?.(session.user);
        
        try {
          const details = await fetchUserDetails(session.user.id);
          if (details && mounted) {
            setUserDetails(details);
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("[AuthProvider] Error fetching user details after state change:", error);
          if (mounted) navigate("/login");
        }
      } else {
        setSession?.(null);
        setUser?.(null);
        setUserDetails(null);
        if (event === "SIGNED_OUT" && mounted) {
          navigate("/login", { replace: true });
        }
      }
      
      if (mounted) setLoading?.(false);
    });

    // Start initialization
    initializeAuth();

    // Cleanup function
    return () => {
      console.log("[AuthProvider] Cleaning up");
      mounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
      subscription.unsubscribe();
    };
  }, [navigate, setLoading, setSession, setUser, setUserDetails, fetchUserDetails, retryCount]);

  // Loading state
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

  // Error state
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}