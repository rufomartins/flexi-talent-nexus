import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TalentNoteForm } from "./TalentNoteForm";
import type { TalentNote } from "@/types/shot-list";

interface AddTalentNoteDialogProps {
  shotListId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTalentNoteDialog({ 
  shotListId,
  open, 
  onOpenChange 
}: AddTalentNoteDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: Partial<TalentNote>) {
    setIsSubmitting(true);
    
    try {
      // Form validation
      if (!values.shot_reference || !values.instructions) {
        toast({
          title: "Validation Error",
          description: "Shot reference and instructions are required",
          variant: "destructive",
        });
        return;
      }

      // Note: Actual submission will be implemented in the next step
      // This is just the UI implementation
      console.log('Form values:', values);
      
      toast({
        title: "Success",
        description: "Note added successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['talent-notes'] });
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: "Error",
        description: "Could not add note",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Talent Note</DialogTitle>
        </DialogHeader>
        <TalentNoteForm
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}