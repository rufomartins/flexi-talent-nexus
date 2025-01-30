import { Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface BulkActionsProps {
  selectedCount: number;
  actions: { label: string; action: string }[];
  onActionSelect: (action: string) => Promise<void>;
}

export function BulkActions({
  selectedCount,
  actions,
  onActionSelect
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex gap-2">
      {actions.map((action) => (
        <Button
          key={action.action}
          onClick={() => onActionSelect(action.action)}
          size="sm"
          className="flex items-center gap-2"
        >
          {action.action === 'contact' ? (
            <Mail className="h-4 w-4" />
          ) : action.action === 'sms' ? (
            <MessageSquare className="h-4 w-4" />
          ) : null}
          {action.label}
        </Button>
      ))}
    </div>
  );
}