import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DeadlinePreviewProps {
  deadlines: {
    approaching: readonly number[];
    overdue: readonly number[];
  };
  onSelectDeadline: (days: number, type: 'approaching' | 'overdue') => void;
}

export function DeadlinePreview({ deadlines, onSelectDeadline }: DeadlinePreviewProps) {
  return (
    <Card className="p-4">
      <h3 className="font-medium mb-3">Deadline Scenarios</h3>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm text-muted-foreground mb-2">Approaching Deadlines</h4>
          <div className="flex flex-wrap gap-2">
            {Array.from(deadlines.approaching).map((days) => (
              <Button
                key={`approaching-${days}`}
                variant="outline"
                size="sm"
                onClick={() => onSelectDeadline(days, 'approaching')}
              >
                {days} days before
              </Button>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm text-muted-foreground mb-2">Overdue Deadlines</h4>
          <div className="flex flex-wrap gap-2">
            {Array.from(deadlines.overdue).map((days) => (
              <Button
                key={`overdue-${days}`}
                variant="outline"
                size="sm"
                onClick={() => onSelectDeadline(days, 'overdue')}
              >
                {days} days after
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}