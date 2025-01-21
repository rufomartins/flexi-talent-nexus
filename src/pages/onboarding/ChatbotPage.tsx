import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ChatbotPage = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNext = () => {
    if (!candidateId) {
      toast({
        title: "Error",
        description: "Invalid candidate ID",
        variant: "destructive",
      });
      return;
    }
    navigate(`/onboarding/schedule/${candidateId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10 flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full p-8 space-y-6 animate-fade-in">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Let's Get to Know You Better
          </h1>
          <p className="text-muted-foreground">
            Please answer a few questions to help us understand your experience and interests.
          </p>
        </div>
        
        <div className="h-[400px] bg-secondary/20 rounded-lg flex flex-col items-center justify-center gap-4">
          <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">Chatbot interface coming soon...</p>
          <p className="text-sm text-muted-foreground/75">We're preparing an interactive chat experience to learn more about you.</p>
        </div>

        <div className="flex justify-center">
          <Button onClick={handleNext}>
            Continue to Scheduling
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChatbotPage;