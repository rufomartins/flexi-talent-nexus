import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CandidateInterviewsProps {
  candidateId: string;
}

export function CandidateInterviews({ candidateId }: CandidateInterviewsProps) {
  const { data: interviews, isLoading } = useQuery({
    queryKey: ['candidate-interviews', candidateId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('onboarding_interviews')
        .select('*')
        .eq('candidate_id', candidateId)
        .order('scheduled_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading interviews...</div>;
  }

  return (
    <div className="space-y-4">
      {interviews && interviews.length > 0 ? (
        interviews.map((interview) => (
          <Card key={interview.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {new Date(interview.scheduled_at).toLocaleString()}
                </p>
                <Badge>{interview.status}</Badge>
              </div>
              {interview.notes && (
                <p className="text-sm text-muted-foreground mt-2">
                  {interview.notes}
                </p>
              )}
            </div>
          </Card>
        ))
      ) : (
        <p>No interviews scheduled</p>
      )}
    </div>
  );
}