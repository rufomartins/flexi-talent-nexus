import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useAuthSession } from "./useAuthSession";
import { useUserDetails } from "./useUserDetails";
import { useAuthActions } from "./useAuthActions";
import { supabase } from "@/integrations/supabase/client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { 
    session, 
    user, 
    loading, 
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[Auth] Auth state changed:", event, session ? "Has session" : "No session");

      if (session?.user) {
        console.log("[Auth] Setting session and user state");
        setSession?.(session);
        setUser?.(session.user);
        
        const details = await fetchUserDetails(session.user.id);
        if (details) {
          console.log("[Auth] Updated user details after state change");
          setUserDetails(details);
        } else {
          console.error("[Auth] Failed to fetch user details after state change");
        }
      } else {
        console.log("[Auth] Clearing session and user state");
        setSession?.(null);
        setUser?.(null);
        setUserDetails(null);
        if (event === "SIGNED_OUT") {
          console.log("[Auth] User signed out, redirecting to login");
          navigate("/login", { replace: true });
        }
      }
      
      setLoading?.(false);
    });

    return () => {
      console.log("[Auth] Cleaning up auth state subscription");
      subscription.unsubscribe();
    };
  }, [navigate, setLoading, setSession, setUser, setUserDetails, fetchUserDetails]);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userDetails,
        setUserDetails,
        signIn,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}