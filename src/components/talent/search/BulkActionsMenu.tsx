import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Mail, UserPlus, Download, MoreHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BulkEmailDialog } from "../email/BulkEmailDialog";
import { TalentProfile } from "@/types/talent";

interface BulkActionsMenuProps {
  selectedIds: string[];
  onClearSelection: () => void;
  onSelectAll: () => void;
}

export const BulkActionsMenu = ({
  selectedIds,
  onClearSelection,
  onSelectAll,
}: BulkActionsMenuProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [selectedTalents, setSelectedTalents] = useState<TalentProfile[]>([]);

  const handleAddToCasting = async () => {
    // Implementation for adding to casting
    toast({
      title: "Adding to casting",
      description: "This feature is coming soon",
    });
  };

  const handleBulkEmail = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('talent_profiles')
        .select(`
          *,
          users!talent_profiles_user_id_fkey (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .in('id', selectedIds);

      if (error) {
        console.error('Error fetching talents:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from query');
      }

      const transformedData = data.map(talent => ({
        ...talent,
        users: {
          id: talent.users?.id || '',
          first_name: talent.users?.first_name || '',
          last_name: talent.users?.last_name || '',
          full_name: talent.users?.first_name && talent.users?.last_name 
            ? `${talent.users.first_name} ${talent.users.last_name}`.trim()
            : '',
          avatar_url: talent.users?.avatar_url
        }
      })) as TalentProfile[];

      setSelectedTalents(transformedData);
      setIsEmailDialogOpen(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('talent_profiles')
        .select(`
          *,
          users!talent_profiles_user_id_fkey (
            full_name,
            email
          )
        `)
        .in('id', selectedIds);

      if (error) throw error;

      toast({
        title: "Export successful",
        description: `Exported ${selectedIds.length} talents`,
      });
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: "Could not export talent data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between bg-muted p-2 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">
            {selectedIds.length} selected
          </span>
          <Button variant="outline" size="sm" onClick={onSelectAll}>
            Select All
          </Button>
          <Button variant="outline" size="sm" onClick={onClearSelection}>
            Clear
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkEmail}
            disabled={isLoading}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddToCasting}
            disabled={isLoading}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add to Casting
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isLoading}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                toast({
                  title: "Status update",
                  description: "This feature is coming soon",
                });
              }}>
                Update Status
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <BulkEmailDialog
        selectedTalents={selectedTalents}
        isOpen={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
      />
    </>
  );
};