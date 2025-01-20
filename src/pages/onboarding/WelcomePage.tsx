import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const welcomeText = {
  title: "Welcome to Global Talent Management Division",
  content: [
    "Thank you for accepting our invitation to GTMD – our exclusive talent management platform serving leading UGC production studios and global brands.",
    "We prioritize building strong relationships with select creators who share our quality standards.",
    "The next step is a brief chat to understand your creative style and discuss opportunities. After this, you'll gain access to exclusive casting opportunities.",
    "Ready to begin?"
  ]
};

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10 flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full p-8 space-y-6">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            {welcomeText.title}
          </h1>
          <div className="space-y-4 text-muted-foreground">
            {welcomeText.content.map((paragraph, index) => (
              <p key={index} className="max-w-2xl mx-auto">
                {paragraph}
              </p>
            ))}
          </div>
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