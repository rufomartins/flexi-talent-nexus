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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CastingType } from "@/types/casting";
import { MediaUploadDialog } from "@/components/talents/MediaUploadDialog";
import { CastingLogoUpload } from "./CastingLogoUpload";
import { castingFormSchema, CastingFormData, defaultValues } from "./CastingFormSchema";
import { HomeIcon } from "lucide-react";

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
    defaultValues: {
      ...defaultValues,
      type,
      name: "",
    },
  });

  const createCasting = useMutation({
    mutationFn: async (data: CastingFormData) => {
      const { data: casting, error } = await supabase
        .from('castings')
        .insert({
          ...data,
          type: data.type,
          name: data.name,
          status: data.status,
        })
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
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6 text-sm">
          <a href="/" className="text-gray-500 hover:text-gray-700">
            <HomeIcon className="w-4 h-4" />
          </a>
          <span className="text-gray-400">/</span>
          <span>Castings</span>
          <span className="text-gray-400">/</span>
          <span>New</span>
        </div>

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
          name="client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="carlos">- Carlos Martins</SelectItem>
                  <SelectItem value="bolt">Bolt - Svetlana Bakushina</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="project_manager_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agency</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an agency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="briefing"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Talent Briefing
                <span className="text-gray-500 text-xs ml-1">
                  (will be sent to talents in availability mails)
                </span>
              </FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Enter briefing details..."
                  className="min-h-[150px]"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {type === 'external' && (
          <>
            <FormField
              control={form.control}
              name="show_briefing_on_signup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Show this briefing on the sign-up form</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(value === 'yes')} 
                    defaultValue={field.value ? 'yes' : 'no'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allow_talent_portal_apply"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Allow talents to apply to this casting using their "my ugc talent casting" environment
                  </FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(value === 'yes')} 
                    defaultValue={field.value ? 'yes' : 'no'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
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
            Save
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