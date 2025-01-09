import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NotificationType } from "@/types/notifications";

interface NotificationTypeListProps {
  types: readonly NotificationType[];
  onSelect: (type: NotificationType) => void;
}

export function NotificationTypeList({ types, onSelect }: NotificationTypeListProps) {
  return (
    <Card className="p-4">
      <h3 className="font-medium mb-3">Notification Types</h3>
      <div className="space-y-2">
        {Array.from(types).map((type) => (
          <Button
            key={type}
            variant="outline"
            className="w-full justify-start"
            onClick={() => onSelect(type)}
          >
            {type}
          </Button>
        ))}
      </div>
    </Card>
  );
}