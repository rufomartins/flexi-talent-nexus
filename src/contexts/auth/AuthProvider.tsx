import { createContext, useEffect, useState } from "react";
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
    try {
      console.log("Fetching user details for:", userId);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user details:", error);
        return null;
      }

      console.log("User details fetched:", data);
      return data;
    } catch (error) {
      console.error("Exception in fetchUserDetails:", error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("Starting auth initialization...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (!mounted) return;

        if (session?.user) {
          console.log("Session found, setting user");
          setSession(session);
          setUser(session.user);
          
          const details = await fetchUserDetails(session.user.id);
          if (mounted && details) {
            console.log("Setting user details");
            setUserDetails(details);
          }
        } else {
          console.log("No session found");
          setSession(null);
          setUser(null);
          setUserDetails(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          toast({
            title: "Error",
            description: "Failed to initialize authentication.",
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) {
          console.log("Auth initialization complete");
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log("Auth state changed:", event);

      if (session?.user) {
        setSession(session);
        setUser(session.user);
        const details = await fetchUserDetails(session.user.id);
        if (mounted && details) {
          setUserDetails(details);
        }
      } else {
        setSession(null);
        setUser(null);
        setUserDetails(null);
        if (event === "SIGNED_OUT") {
          navigate("/login", { replace: true });
        }
      }
      
      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const signOut = async () => {
    console.log("Attempting sign out");
    setLoading(true);
    try {
      setSession(null);
      setUser(null);
      setUserDetails(null);
      
      localStorage.clear();
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Supabase signOut error:", error);
        throw error;
      }
      
      console.log("Successfully signed out from Supabase");
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });

      console.log("Navigating to login page");
      navigate('/login', { replace: true });
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Error",
        description: "There was an error signing out.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
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

      if (data.user) {
        const userDetails = await fetchUserDetails(data.user.id);
        if (!userDetails) {
          throw new Error("Failed to fetch user details");
        }
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
