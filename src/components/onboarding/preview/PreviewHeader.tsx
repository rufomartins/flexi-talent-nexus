import { Button } from "@/components/ui/button";

interface PreviewHeaderProps {
  selectedCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export function PreviewHeader({ selectedCount, onCancel, onConfirm }: PreviewHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold">Preview Data</h2>
      <div className="space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>
          Confirm Import ({selectedCount} rows)
        </Button>
      </div>
    </div>
  );
}