import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

interface CandidateDocumentsProps {
  candidateId: string;
}

export function CandidateDocuments({ candidateId }: CandidateDocumentsProps) {
  const { data: documents, isLoading } = useQuery({
    queryKey: ['candidate-documents', candidateId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('talent_files')
        .select('*')
        .eq('talent_id', candidateId);

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading documents...</div>;
  }

  return (
    <div className="space-y-4">
      {documents && documents.length > 0 ? (
        documents.map((doc) => (
          <Card key={doc.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{doc.file_name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(doc.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <p>No documents available</p>
      )}
    </div>
  );
}