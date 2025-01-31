import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
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
              {field.value ? (
                <img 
                  src={field.value} 
                  alt="Logo" 
                  className="w-32 h-32 object-cover rounded-lg"
                />
              ) : (
                <div 
                  className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
                  onClick={onUploadClick}
                  role="button"
                  tabIndex={0}
                >
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
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