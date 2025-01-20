import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10 flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full p-8 space-y-6">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome to Global Talent Management Division
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Thank you for your interest in joining our talent network. We're excited to learn more about you and your skills.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-secondary/50 p-6 rounded-lg space-y-4">
            <h2 className="text-xl font-medium">What to Expect</h2>
            <ul className="space-y-3 list-disc pl-6 text-muted-foreground">
              <li>Watch our welcome video to learn about our process</li>
              <li>Complete a brief questionnaire about your experience</li>
              <li>Schedule a short interview with our team</li>
              <li>Receive feedback and next steps</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <Button 
              size="lg"
              className="min-w-[200px]"
              onClick={() => {
                // This will be replaced with actual candidateId from URL params or query
                const demoId = "demo-candidate-id";
                window.location.href = `/onboarding/welcome-video/${demoId}`;
              }}
            >
              Get Started
            </Button>
          </div>
        </div>

        <footer className="text-center text-sm text-muted-foreground pt-4 border-t">
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

export default WelcomePage;