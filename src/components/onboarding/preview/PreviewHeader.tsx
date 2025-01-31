import { Button } from "@/components/ui/button";

interface PreviewHeaderProps {
  selectedCount: number;
  onCancel: () => void;
  onConfirm: () => void;
  isImporting: boolean;
}

export function PreviewHeader({ selectedCount, onCancel, onConfirm, isImporting }: PreviewHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold">Preview Data</h2>
      <div className="space-x-4">
        <Button variant="outline" onClick={onCancel} disabled={isImporting}>
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          disabled={selectedCount === 0 || isImporting}
        >
          {isImporting ? 'Importing...' : `Confirm Import (${selectedCount} rows)`}
        </Button>
      </div>
    </div>
  );
}