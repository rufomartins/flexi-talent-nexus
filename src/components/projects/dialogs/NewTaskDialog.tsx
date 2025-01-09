import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AssignmentSection } from "./components/AssignmentSection";
import { TaskDetailsSection } from "./components/TaskDetailsSection";
import { DeadlineSection } from "./components/DeadlineSection";
import type { Language } from "../types";

const formSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  languageId: z.string().min(1, "Language is required"),
  deadline: z.date(),
  priority: z.enum(["High", "Medium", "Low"]),
  description: z.string().optional(),
  translatorId: z.string().optional(),
  reviewerId: z.string().optional(),
  ugcTalentId: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface NewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  languages: Language[];
  onSubmit: (data: FormData) => Promise<void>;
}

export function NewTaskDialog({ 
  open, 
  onOpenChange,
  languages,
  onSubmit: handleSubmitTask
}: NewTaskDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      priority: "Medium",
      deadline: new Date(),
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await handleSubmitTask(data);
      toast({
        title: "Success",
        description: "Task created successfully",
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <TaskDetailsSection form={form} />
            <DeadlineSection form={form} />
            
            <AssignmentSection
              form={form}
              roleType="translator"
              label="Translator"
            />
            
            <AssignmentSection
              form={form}
              roleType="reviewer"
              label="Reviewer"
            />
            
            <AssignmentSection
              form={form}
              roleType="ugc_talent"
              label="UGC Talent"
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}