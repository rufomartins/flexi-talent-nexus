import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CastingType } from "@/types/casting";
import { MediaUploadDialog } from "@/components/talents/MediaUploadDialog";
import { castingFormSchema, CastingFormData, defaultValues } from "./CastingFormSchema";
import { CastingLogoUpload } from "./CastingLogoUpload";

interface NewCastingFormProps {
  type: CastingType;
  onSuccess?: () => void;
}

export function NewCastingForm({ type, onSuccess }: NewCastingFormProps) {
  const [logoUploadOpen, setLogoUploadOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<CastingFormData>({
    resolver: zodResolver(castingFormSchema),
    defaultValues: defaultValues(type),
  });

  const createCasting = useMutation({
    mutationFn: async (data: CastingFormData) => {
      const { data: casting, error } = await supabase
        .from('castings')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return casting;
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Casting created successfully",
      });
      onSuccess?.();
      navigate(`/castings/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create casting",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CastingFormData) => {
    createCasting.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CastingLogoUpload 
            form={form} 
            onUploadClick={() => setLogoUploadOpen(true)} 
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Casting Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Wolt Finland" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="briefing"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Talent Briefing</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Enter briefing details..."
                  className="min-h-[150px]"
                />
              </FormControl>
              <FormDescription>
                This will be sent to talents in availability requests
              </FormDescription>
            </FormItem>
          )}
        />

        {type === 'external' && (
          <>
            <FormField
              control={form.control}
              name="show_briefing_on_signup"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Show briefing on sign-up form</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter description..."
                      className="min-h-[100px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="allow_talent_portal_apply"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Allow talents to apply using their Talent Profile</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={createCasting.isPending}
          >
            Create Casting
          </Button>
        </div>
      </form>

      <MediaUploadDialog
        open={logoUploadOpen}
        onOpenChange={setLogoUploadOpen}
        talentId=""
        talentRole="user"
      />
    </Form>
  );
}