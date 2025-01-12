import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StatusSectionProps {
  id: string;
  status: 'new' | 'emailed' | 'interviewed' | 'approved';
  onStatusChange: (newStatus: 'new' | 'emailed' | 'interviewed' | 'approved') => void;
}

export function StatusSection({ id, status, onStatusChange }: StatusSectionProps) {
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: 'new' | 'emailed' | 'interviewed' | 'approved') => {
    const { error } = await supabase
      .from("onboarding_candidates")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Status updated successfully",
    });
    
    onStatusChange(newStatus);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "interviewed":
        return "bg-blue-100 text-blue-800";
      case "emailed":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Status:</span>
      <Badge className={getStatusColor(status)}>
        {status}
      </Badge>
      <div className="flex flex-wrap gap-2 ml-auto">
        <Button onClick={() => handleStatusChange('emailed')} variant="outline" size="sm">
          Send Email
        </Button>
        <Button onClick={() => handleStatusChange('interviewed')} variant="outline" size="sm">
          Schedule Interview
        </Button>
        <Button 
          onClick={() => handleStatusChange('approved')}
          variant="default"
          size="sm"
          className="bg-green-600 hover:bg-green-700"
        >
          Approve Candidate
        </Button>
      </div>
    </div>
  );
}