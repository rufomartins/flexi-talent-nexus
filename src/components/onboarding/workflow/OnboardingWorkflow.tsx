import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExcelParser } from "../ExcelParser";
import { CandidateList } from "../CandidateList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { ExcelRowData } from "@/utils/excelValidation";
import type { Candidate } from "@/types/onboarding";

export function OnboardingWorkflow() {
  const [currentStage, setCurrentStage] = useState<string>("ingest");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const { data: candidates, isLoading, error } = useQuery({
    queryKey: ["onboarding-candidates"],
    queryFn: async () => {
      console.log("[OnboardingWorkflow] Fetching candidates...");
      
      const { data, error } = await supabase
        .from("onboarding_candidates")
        .select(`
          id,
          name,
          email,
          phone,
          status,
          stage,
          created_at,
          communication_status,
          scout:scout_id (
            id,
            full_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[OnboardingWorkflow] Error:", error);
        throw error;
      }

      return data as Candidate[];
    }
  });

  const handleValidDataReceived = async (data: ExcelRowData[]) => {
    try {
      const { error } = await supabase.from("onboarding_candidates").insert(
        data.map(row => ({
          name: row.full_name,
          email: row.public_email,
          phone: row.public_phone,
          status: "new" as const, // Explicitly set as 'new' to match enum
          stage: "ingest" as const,
          username: row.username,
          followers_count: row.followers_count,
          following_count: row.following_count,
          profile_url: row.profile_url,
          external_url: row.external_url,
          biography: row.biography
        }))
      );

      if (error) throw error;

      toast({
        title: "Success",
        description: `Successfully imported ${data.length} candidates`,
      });
      
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Error importing candidates:", error);
      toast({
        title: "Error",
        description: "Failed to import candidates",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
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
                  toast({
                    title: "Error",
                    description: error,
                    variant: "destructive",
                  });
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
        </TabsContent>

        <TabsContent value="process">
          <CandidateList
            candidates={candidates?.filter(c => c.stage === "process") || []}
            isLoading={isLoading}
            error={error as Error}
          />
        </TabsContent>

        <TabsContent value="screening">
          <CandidateList
            candidates={candidates?.filter(c => c.stage === "screening") || []}
            isLoading={isLoading}
            error={error as Error}
          />
        </TabsContent>

        <TabsContent value="results">
          <CandidateList
            candidates={candidates?.filter(c => c.stage === "results") || []}
            isLoading={isLoading}
            error={error as Error}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}