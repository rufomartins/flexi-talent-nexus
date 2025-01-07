import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/utils/notifications";

interface AddShotFormProps {
  shotListId: string;
  onSuccess: () => void;
}

interface FormValues {
  shot_number: number;
  description: string;
  frame_type: string;
  notes?: string;
  location_id?: string;
}

export function AddShotForm({ shotListId, onSuccess }: AddShotFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    defaultValues: {
      shot_number: 1,
      description: "",
      frame_type: "",
      notes: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    // Get the current highest sequence order
    const { data: maxSequence } = await supabase
      .from("shots")
      .select("sequence_order")
      .eq("shot_list_id", shotListId)
      .order("sequence_order", { ascending: false })
      .limit(1)
      .single();

    const newSequenceOrder = (maxSequence?.sequence_order || 0) + 1;

    const { error } = await supabase.from("shots").insert({
      ...values,
      shot_list_id: shotListId,
      sequence_order: newSequenceOrder,
      status: "Pending",
    });

    setIsSubmitting(false);

    if (error) {
      notify.error("Failed to add shot");
      console.error("Error adding shot:", error);
      return;
    }

    notify.success("Shot added successfully");
    queryClient.invalidateQueries({ queryKey: ["shots"] });
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="shot_number"
          rules={{ required: "Shot number is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shot Number</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          rules={{ required: "Description is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="frame_type"
          rules={{ required: "Frame type is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frame Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frame type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="wide">Wide Shot</SelectItem>
                  <SelectItem value="medium">Medium Shot</SelectItem>
                  <SelectItem value="close-up">Close Up</SelectItem>
                  <SelectItem value="extreme-close-up">Extreme Close Up</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Shot"}
          </Button>
        </div>
      </form>
    </Form>
  );
}