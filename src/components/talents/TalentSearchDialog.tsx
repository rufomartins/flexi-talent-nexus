import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const searchFormSchema = z.object({
  firstName: z.string().optional(),
  gender: z.enum(["male", "female"]).optional(),
  talentCategory: z.string().optional(),
  nativeLanguage: z.string().optional(),
  country: z.string().optional(),
  owner: z.string().optional(),
  agent: z.string().optional(),
  scout: z.string().optional(),
})

type SearchFormValues = z.infer<typeof searchFormSchema>

interface TalentSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSearch: (values: SearchFormValues) => void
}

export function TalentSearchDialog({ open, onOpenChange, onSearch }: TalentSearchDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      firstName: "",
      gender: undefined,
      talentCategory: "",
      nativeLanguage: "",
      country: "",
      owner: "",
      agent: "",
      scout: "",
    }
  })

  const onSubmit = async (values: SearchFormValues) => {
    setIsLoading(true)
    try {
      onSearch(values)
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Search Talent</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="talentCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Talent Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="translator">Translator</SelectItem>
                      <SelectItem value="reviewer">Reviewer</SelectItem>
                      <SelectItem value="vo">Voice Over</SelectItem>
                      <SelectItem value="ugc">UGC</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                Search
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}