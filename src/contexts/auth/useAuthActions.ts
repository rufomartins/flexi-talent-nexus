import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuthActions = (
  setLoading: (loading: boolean) => void,
  setSession: (session: any) => void,
  setUser: (user: any) => void,
  setUserDetails: (details: any) => void,
  fetchUserDetails: (userId: string) => Promise<any>
) => {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return { signIn, signOut };
};