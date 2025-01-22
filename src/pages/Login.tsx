import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { RouteErrorBoundary } from "@/components/error/RouteErrorBoundary";
import { Card } from "@/components/common/Card";

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <RouteErrorBoundary>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full px-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Global Talent Management Division
            </h1>
            <p className="text-gray-600">
              Sign in to access your admin dashboard
            </p>
          </div>

          <Card>
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#000000',
                      brandAccent: '#666666',
                    },
                  },
                },
              }}
              providers={[]}
              view="sign_in"
              showLinks={false}
              redirectTo={`${window.location.origin}/dashboard`}
            />
          </Card>
        </div>
      </div>
    </RouteErrorBoundary>
  );
}