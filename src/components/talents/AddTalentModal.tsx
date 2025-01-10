import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { notify } from "@/utils/notifications"
import { DuoPartnerSearch } from "./DuoPartnerSearch"
import { SelectedPartner } from "./SelectedPartner"

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  isDuo: z.boolean().default(false),
  duoName: z.string().optional(),
});

type AddTalentFormValues = z.infer<typeof formSchema>;

interface AddTalentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTalentModal({ open, onOpenChange }: AddTalentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [duplicateUser, setDuplicateUser] = useState<{ id: string; full_name: string } | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<DuoPartner | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<AddTalentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      isDuo: false,
      duoName: "",
    }
  });

  const handleSaveDuo = async (data: AddTalentFormValues) => {
    try {
      setIsLoading(true);
      const { isDuo, duoName, ...talentData } = data;

      if (isDuo && !selectedPartner) {
        toast({
          title: "Error",
          description: "Partner is required for duo talents",
          variant: "destructive"
        });
        return;
      }

      // Create new user
      const { data: newUser, error: userError } = await supabase.auth.signUp({
        email: talentData.email,
        password: Math.random().toString(36).slice(-8),
        options: {
          data: {
            full_name: `${talentData.firstName} ${talentData.lastName}`,
            role: "ugc_talent"
          }
        }
      });

      if (userError) throw userError;

      if (newUser.user) {
        // Create talent profile
        const { data: talent, error: profileError } = await supabase
          .from("talent_profiles")
          .insert({
            user_id: newUser.user.id,
            evaluation_status: "under_evaluation",
            is_duo: isDuo,
            partner_id: selectedPartner?.id,
            duo_name: isDuo ? duoName : null
          })
          .select()
          .single();

        if (profileError) throw profileError;

        // Update partner record if this is a duo
        if (isDuo && selectedPartner) {
          const { error: partnerError } = await supabase
            .from("talent_profiles")
            .update({
              is_duo: true,
              partner_id: talent.id,
              duo_name: duoName
            })
            .eq("id", selectedPartner.id);

          if (partnerError) {
            toast({
              title: "Error",
              description: "Failed to update partner record",
              variant: "destructive"
            });
            return;
          }
        }

        toast({
          title: "Success",
          description: "New talent has been added successfully.",
        });

        onOpenChange(false);
        navigate(`/talents/${talent.id}`);
      }
    } catch (error: any) {
      console.error("Error adding talent:", error);
      toast({
        title: "Error",
        description: "Failed to add new talent. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new talent</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSaveDuo)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isDuo"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Is this a duo/couple?</FormLabel>
                </FormItem>
              )}
            />

            {form.watch("isDuo") && (
              <div className="space-y-4">
                {selectedPartner ? (
                  <SelectedPartner
                    partner={selectedPartner}
                    onRemove={() => setSelectedPartner(null)}
                  />
                ) : (
                  <DuoPartnerSearch
                    onSelect={setSelectedPartner}
                    currentTalentId={duplicateUser?.id}
                  />
                )}
                {selectedPartner && (
                  <FormField
                    control={form.control}
                    name="duoName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duo Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter duo/couple name..." disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
