import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useAuthSession } from "./useAuthSession";
import { useUserDetails } from "./useUserDetails";
import { useAuthActions } from "./useAuthActions";
import { supabase } from "@/integrations/supabase/client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log("[AuthProvider] Initializing with new logging");
  
  const navigate = useNavigate();
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

  useEffect(() => {
    console.log("[AuthProvider] Setting up auth state listener");
    let mounted = true;
    
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

    return () => {
      console.log("[AuthProvider] Cleaning up auth state subscription");
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, setLoading, setSession, setUser, setUserDetails, fetchUserDetails]);

  const contextValue = {
    session,
    user,
    userDetails,
    setUserDetails,
    signIn,
    signOut,
    loading: sessionLoading,
  };

  console.log("[AuthProvider] Rendering with context:", {
    hasSession: !!session,
    hasUser: !!user,
    hasUserDetails: !!userDetails,
    isLoading: sessionLoading
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}