import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { InterviewScheduler } from "@/components/onboarding/InterviewScheduler";

const SchedulePage = () => {
  const { candidateId } = useParams();
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10 flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full p-8 space-y-6 animate-fade-in">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Schedule Your Interview
          </h1>
          <p className="text-muted-foreground">
            Choose a convenient time for your interview with our team.
          </p>
        </div>
        
        {candidateId && (
          <InterviewScheduler
            open={isSchedulerOpen}
            onOpenChange={setIsSchedulerOpen}
            candidateId={candidateId}
            candidateName="Candidate" // This will be replaced with actual name
          />
        )}
      </Card>
    </div>
  );
};

export default SchedulePage;