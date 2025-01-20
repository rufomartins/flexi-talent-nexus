import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";

const SchedulePage = () => {
  const { candidateId } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10 flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full p-8 space-y-6">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Schedule Your Interview
          </h1>
          <p className="text-muted-foreground">
            Choose a convenient time for your interview with our team.
          </p>
        </div>
        
        {/* Calendar interface will be implemented here */}
        <div className="h-[400px] bg-secondary/20 rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Calendar scheduling interface coming soon...</p>
        </div>
      </Card>
    </div>
  );
};

export default SchedulePage;