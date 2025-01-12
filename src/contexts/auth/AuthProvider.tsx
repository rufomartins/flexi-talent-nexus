import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthContextType } from "./types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchUserDetails = async (userId: string) => {
    console.log("Fetching user details for:", userId);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user details:", error);
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load user details. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("User details fetched successfully:", data);
      setUserDetails(data);
      setLoading(false);
    } catch (error) {
      console.error("Exception in fetchUserDetails:", error);
      setLoading(false);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading user details.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    console.log("AuthProvider mounted");
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session check:", session ? "Found session" : "No session");
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            await fetchUserDetails(session.user.id);
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error in initializeAuth:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session ? "Has session" : "No session");
      
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserDetails(session.user.id);
        } else {
          setUserDetails(null);
          setLoading(false);
          if (event === "SIGNED_OUT") {
            navigate("/login");
          }
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    console.log("Attempting sign out");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear all auth state
      setSession(null);
      setUser(null);
      setUserDetails(null);
      
      // Clear all localStorage
      localStorage.clear();
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });

      navigate('/login');
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Error",
        description: "There was an error signing out.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string, rememberMe: boolean) => {
    console.log("Attempting sign in for:", email);
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userDetails,
        signIn,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
