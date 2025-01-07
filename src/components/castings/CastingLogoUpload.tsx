import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { CastingFormData } from "./CastingFormSchema";

interface CastingLogoUploadProps {
  form: UseFormReturn<CastingFormData>;
  onUploadClick: () => void;
}

export function CastingLogoUpload({ form, onUploadClick }: CastingLogoUploadProps) {
  return (
    <FormField
      control={form.control}
      name="logo_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Casting Logo</FormLabel>
          <FormControl>
            <div className="flex items-center gap-4">
              {field.value && (
                <img 
                  src={field.value} 
                  alt="Logo" 
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <Button
                type="button"
                variant="outline"
                onClick={onUploadClick}
              >
                Upload Logo
              </Button>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}