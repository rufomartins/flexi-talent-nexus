import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address")
})

type AddTalentFormValues = z.infer<typeof formSchema>

interface AddTalentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddTalentModal({ open, onOpenChange }: AddTalentModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [duplicateUser, setDuplicateUser] = useState<{ id: string; full_name: string } | null>(null)
  const { toast } = useToast()
  const navigate = useNavigate()

  const form = useForm<AddTalentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: ""
    }
  })

  const checkExistingEmail = async (email: string) => {
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, full_name")
      .eq("email", email)
      .single()

    if (existingUser) {
      setDuplicateUser(existingUser)
      return true
    }
    setDuplicateUser(null)
    return false
  }

  const onSubmit = async (values: AddTalentFormValues) => {
    try {
      setIsLoading(true)

      // Check for existing email
      const isDuplicate = await checkExistingEmail(values.email)
      if (isDuplicate) {
        return
      }

      // Create new user
      const { data: newUser, error: userError } = await supabase.auth.signUp({
        email: values.email,
        password: Math.random().toString(36).slice(-8), // Generate random password
        options: {
          data: {
            full_name: `${values.firstName} ${values.lastName}`,
            role: "ugc_talent"
          }
        }
      })

      if (userError) throw userError

      if (newUser.user) {
        // Create talent profile
        const { error: profileError } = await supabase
          .from("talent_profiles")
          .insert({
            user_id: newUser.user.id,
            evaluation_status: "under_evaluation"
          })

        if (profileError) throw profileError

        toast({
          title: "Success",
          description: "New talent has been added successfully.",
        })

        onOpenChange(false)
        navigate(`/talents/${newUser.user.id}`)
      }
    } catch (error: any) {
      console.error("Error adding talent:", error)
      toast({
        title: "Error",
        description: "Failed to add new talent. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new talent</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            {duplicateUser && (
              <div className="text-sm text-blue-600">
                <span>This email is already registered. </span>
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal"
                  onClick={() => navigate(`/talents/${duplicateUser.id}`)}
                >
                  View profile
                </Button>
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              After saving, you'll be redirected to complete the full talent profile.
            </div>
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
  )
}