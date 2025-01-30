import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExcelParser } from "../ExcelParser";
import { CandidateList } from "../CandidateList";
import { CommunicationMetrics } from "../list/CommunicationMetrics";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Candidate, ExcelRowData } from "@/types/onboarding";

export function OnboardingWorkflow() {
  const [currentStage, setCurrentStage] = useState<string>("ingest");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: candidates, isLoading, error } = useQuery({
    queryKey: ["onboarding-candidates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("onboarding_candidates")
        .select(`
          id,
          name,
          first_name,
          last_name,
          email,
          phone,
          status,
          stage,
          language,
          source,
          remarks,
          created_at,
          communication_status,
          scout:scout_id (
            id,
            full_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Candidate[];
    }
  });

  const handleValidDataReceived = async (data: ExcelRowData[]) => {
    try {
      const { error } = await supabase.from("onboarding_candidates").insert(
        data.map(row => ({
          name: `${row.first_name} ${row.last_name}`,
          first_name: row.first_name,
          last_name: row.last_name,
          email: row.email,
          phone: row.phone,
          status: "new" as const,
          stage: "ingest" as const,
          language: row.native_language,
          source: row.source || "excel_import",
          remarks: row.remarks || ""
        }))
      );

      if (error) throw error;
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Error importing candidates:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Communication Metrics - Always visible at top */}
      <div className="grid grid-cols-4 gap-4">
        <CommunicationMetrics 
          ingestCount={candidates?.filter(c => c.stage === "ingest").length || 0}
          processCount={candidates?.filter(c => c.stage === "process").length || 0}
          emailsSent={0} // TODO: Add real metrics
          emailsFailed={0}
          interviewsScheduled={0}
          chatbotConfirmed={0}
          chatbotDeclined={0}
          preScreeningPending={0}
        />
      </div>

      <Tabs value={currentStage} onValueChange={setCurrentStage}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ingest">Ingest</TabsTrigger>
          <TabsTrigger value="process">Process</TabsTrigger>
          <TabsTrigger value="screening">Screening</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="ingest" className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium mb-4">Import Candidates</h3>
            {selectedFile && (
              <ExcelParser
                file={selectedFile}
                onValidDataReceived={handleValidDataReceived}
                onError={(error) => {
                  console.error("Excel parsing error:", error);
                }}
              />
            )}
            <div className="mt-4">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedFile(file);
                  }
                }}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-white
                  hover:file:bg-primary/90"
              />
            </div>
          </div>

          <CandidateList
            candidates={candidates?.filter(c => c.stage === "ingest") || []}
            isLoading={isLoading}
            error={error as Error}
            stage="ingest"
          />
        </TabsContent>

        <TabsContent value="process">
          <CandidateList
            candidates={candidates?.filter(c => c.stage === "process") || []}
            isLoading={isLoading}
            error={error as Error}
            stage="process"
          />
        </TabsContent>

        <TabsContent value="screening">
          <div className="border-b mb-4">
            <nav className="flex space-x-4">
              <a href="#pre-screening" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Pre-Screening</a>
              <a href="#interviews" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Interviews</a>
              <a href="#inbox" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Inbox</a>
              <a href="#chat" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Chat</a>
              <a href="#calendar" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Calendar</a>
            </nav>
          </div>
          <CandidateList
            candidates={candidates?.filter(c => c.stage === "screening") || []}
            isLoading={isLoading}
            error={error as Error}
            stage="screening"
          />
        </TabsContent>

        <TabsContent value="results">
          <CandidateList
            candidates={candidates?.filter(c => c.stage === "results") || []}
            isLoading={isLoading}
            error={error as Error}
            stage="results"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}