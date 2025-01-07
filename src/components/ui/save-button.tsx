import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SaveButtonProps {
  onSave: () => Promise<void>;
  saving: boolean;
  className?: string;
}

export const SaveButton = ({ onSave, saving, className }: SaveButtonProps) => {
  return (
    <Button
      onClick={onSave}
      disabled={saving}
      className={className}
    >
      {saving ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        'Save'
      )}
    </Button>
  );
};