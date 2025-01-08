import { Shot, Location } from '@/types/shot-list';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LocationDeleteDialogProps {
  location: Location;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  affectedShots: Shot[];
  isLoading: boolean;
}

export function LocationDeleteDialog({
  location,
  isOpen,
  onClose,
  onConfirm,
  affectedShots,
  isLoading
}: LocationDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Location</DialogTitle>
          <DialogDescription className="pt-4">
            Are you sure you want to delete the location &quot;{location.name}&quot;?
          </DialogDescription>
        </DialogHeader>

        {affectedShots.length > 0 && (
          <div className="space-y-4">
            <p className="text-destructive font-medium">
              Warning: This location is used in {affectedShots.length} shot{affectedShots.length === 1 ? '' : 's'}:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              {affectedShots.map((shot) => (
                <li key={shot.id} className="text-sm text-muted-foreground">
                  Shot {shot.shot_number}: {shot.description || 'No description'}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground">
              These shots will be updated to remove their location reference.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}