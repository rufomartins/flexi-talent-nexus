import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import { TalentProfileField } from "@/types/talent-fields";
import { useState } from "react";
import { AddFieldDialog } from "./AddFieldDialog";
import { FieldsList } from "./FieldsList";

export const TalentFieldsManager = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: fields, isLoading } = useQuery({
    queryKey: ["talent-profile-fields"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("talent_profile_fields")
        .select("*")
        .order("position");

      if (error) throw error;
      return data as TalentProfileField[];
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Talent Profile Structure</h1>
          <p className="text-muted-foreground">
            Manage the fields that appear in talent profiles
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Field
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <h2 className="font-semibold">Profile Fields</h2>
          </div>
        </div>
        
        <FieldsList fields={fields || []} />
      </div>

      <AddFieldDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />
    </div>
  );
};