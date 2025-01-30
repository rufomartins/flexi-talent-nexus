import { Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface BulkActionsProps {
  selectedCount: number;
  onEmailClick: () => void;
  onSmsClick: () => void;
}

export function BulkActions({
  selectedCount,
  onEmailClick,
  onSmsClick
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex gap-2">
      <Button
        onClick={onEmailClick}
        size="sm"
        className="flex items-center gap-2"
      >
        <Mail className="h-4 w-4" />
        Send Email
      </Button>
      <Button
        onClick={onSmsClick}
        size="sm"
        variant="secondary"
        className="flex items-center gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        Send SMS
      </Button>
    </div>
  );
}