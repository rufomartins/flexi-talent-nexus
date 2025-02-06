import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InterviewSchedulerDialog } from "@/components/onboarding/interview/InterviewSchedulerDialog";
import { EmailAndSmsComposer } from "@/components/onboarding/communication/EmailAndSmsComposer";
import { CandidateDetails } from "@/components/onboarding/profile/CandidateDetails";
import { CandidateDocuments } from "@/components/onboarding/profile/CandidateDocuments";
import { CandidateInterviews } from "@/components/onboarding/profile/CandidateInterviews";
import { CandidateCommunication } from "@/components/onboarding/profile/CandidateCommunication";
import type { Candidate } from "@/types/onboarding";

export default function CandidateProfile() {
  const { id: candidateId } = useParams();
  const [showScheduler, setShowScheduler] = useState(false);
  const [showCommunication, setShowCommunication] = useState(false);

  const { data: candidate, isLoading } = useQuery({
    queryKey: ['onboarding-candidate', candidateId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('onboarding_candidates')
        .select(`
          *,
          scout:scouts(id, full_name),
          native_language
        `)
        .eq('id', candidateId)
        .single();

      if (error) {
        console.error('Error fetching candidate:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Candidate not found');
      }

      return data as Candidate;
    },
    enabled: !!candidateId
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!candidate) {
    return <div>Candidate not found</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{candidate.name}</h1>
          <p className="text-muted-foreground">
            Candidate Profile
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowScheduler(true)}>
            Schedule Interview
          </Button>
          <Button onClick={() => setShowCommunication(true)}>
            Contact
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Details</CardTitle>
            </CardHeader>
            <CardContent>
              <CandidateDetails candidate={candidate} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <CandidateDocuments candidateId={candidateId!} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interviews">
          <Card>
            <CardHeader>
              <CardTitle>Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <CandidateInterviews candidateId={candidateId!} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication">
          <Card>
            <CardHeader>
              <CardTitle>Communication History</CardTitle>
            </CardHeader>
            <CardContent>
              <CandidateCommunication candidateId={candidateId!} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <InterviewSchedulerDialog
        open={showScheduler}
        onOpenChange={setShowScheduler}
        candidateId={candidateId!}
        candidateName={candidate.name}
      />

      <EmailAndSmsComposer
        open={showCommunication}
        onOpenChange={setShowCommunication}
        selectedCandidates={[{
          id: candidateId!,
          name: candidate.name,
          email: candidate.email,
          phone: candidate.phone
        }]}
        candidateId={candidateId}
        candidateName={candidate.name}
        email={candidate.email}
        phone={candidate.phone}
        stage={candidate.stage}
      />
    </div>
  );
}