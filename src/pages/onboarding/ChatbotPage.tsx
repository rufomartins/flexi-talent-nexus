import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";

const ChatbotPage = () => {
  const { candidateId } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10 flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full p-8 space-y-6">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Let's Get to Know You Better
          </h1>
          <p className="text-muted-foreground">
            Please answer a few questions to help us understand your experience and interests.
          </p>
        </div>
        
        {/* Chatbot interface will be implemented here */}
        <div className="h-[400px] bg-secondary/20 rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Chatbot interface coming soon...</p>
        </div>
      </Card>
    </div>
  );
};

export default ChatbotPage;