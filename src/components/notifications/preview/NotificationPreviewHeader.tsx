import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";

interface NotificationPreviewHeaderProps {
  title: string;
  onRefresh?: () => void;
}

export function NotificationPreviewHeader({ title, onRefresh }: NotificationPreviewHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {onRefresh && (
        <Button variant="outline" onClick={onRefresh}>
          Refresh
        </Button>
      )}
    </CardHeader>
  );
}