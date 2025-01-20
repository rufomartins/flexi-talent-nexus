import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10 flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full p-8 space-y-6">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome to Global Talent Management Division
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join our growing community of talented creators. Whether you're a content creator, 
            translator, reviewer, or voice-over artist, we're excited to have you on board.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-medium">New Talent?</h2>
            <p className="text-sm text-muted-foreground">
              Start your journey with us. Register through our casting calls and showcase your talents.
            </p>
            <Button 
              variant="default" 
              className="w-full"
              onClick={() => navigate("/castings")}
            >
              Browse Casting Calls
            </Button>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-medium">Already Registered?</h2>
            <p className="text-sm text-muted-foreground">
              Access your profile, manage your projects, and stay updated on new opportunities.
            </p>
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </Card>
        </div>

        <footer className="text-center text-sm text-muted-foreground pt-8">
          <p>
            Need help? Contact our support team at{" "}
            <a 
              href="mailto:support@gtmd.studio" 
              className="text-primary hover:underline"
            >
              support@gtmd.studio
            </a>
          </p>
        </footer>
      </Card>
    </div>
  );
};

export default Index;