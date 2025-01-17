import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { runAuthDiagnostics } from "@/lib/diagnostics";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log("[Login] Auth state changed:", { 
      hasUser: !!user, 
      isLoading: loading 
    });
    
    if (user) {
      console.log("[Login] User authenticated, redirecting to dashboard");
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("[Login] Running pre-login diagnostics");
      await runAuthDiagnostics();
      
      console.log("[Login] Attempting login for:", email);
      await signIn(email, password, rememberMe);

      // Verify session persistence
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("[Login] Session verification failed:", sessionError);
        throw sessionError;
      }
      console.log("[Login] Session verified:", {
        hasSession: !!session,
        userId: session?.user?.id,
        expiresAt: session?.expires_at
      });

      // Check WebSocket connection status
      const status = supabase.realtime.getChannels().map(channel => ({
        name: channel.topic,
        state: channel.state
      }));
      console.log("[Login] Realtime connection status:", status);

      console.log("[Login] Running post-login diagnostics");
      await runAuthDiagnostics();

    } catch (error) {
      console.error("[Login] Login error:", error);
      console.log("[Login] Running error diagnostics");
      await runAuthDiagnostics();
      
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[#1E293B] mb-2">
            Login to your account
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email address"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={isLoading}
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>

            <button
              type="button"
              className="text-sm text-primary hover:text-primary-hover"
              onClick={() =>
                toast({
                  title: "Reset password",
                  description: "Password reset functionality coming soon",
                })
              }
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#0D6EFD] hover:bg-[#0B5ED7]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;