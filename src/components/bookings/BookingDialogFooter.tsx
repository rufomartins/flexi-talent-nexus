import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface BookingDialogFooterProps {
  onCancel: () => void;
  isSubmitting: boolean;
}

export function BookingDialogFooter({ onCancel, isSubmitting }: BookingDialogFooterProps) {
  return (
    <div className="flex justify-end space-x-2 sticky bottom-0 bg-white p-4 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Booking"
        )}
      </Button>
    </div>
  );
}