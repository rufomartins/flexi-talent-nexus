import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EmailEditor } from "@/components/email-templates/EmailEditor";
import { UseFormReturn } from "react-hook-form";

interface EmailComposerProps {
  form: UseFormReturn<any>;
}

export const EmailComposer: React.FC<EmailComposerProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="subject"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subject</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="body"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Body</FormLabel>
            <FormControl>
              <EmailEditor 
                value={field.value} 
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};