import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Location } from '@/types/shot-list';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface LocationTableProps {
  locations: Location[];
  onEdit: (location: Location) => void;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export function LocationTable({ locations, onEdit, onDelete, isDeleting }: LocationTableProps) {
  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Location Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Time of Day</TableHead>
            <TableHead>Special Requirements</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No locations added yet
              </TableCell>
            </TableRow>
          ) : (
            locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell>{location.name}</TableCell>
                <TableCell>{location.address || '-'}</TableCell>
                <TableCell>{location.time_of_day || '-'}</TableCell>
                <TableCell>{location.special_requirements || '-'}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(location.status)}`}>
                    {location.status || 'Pending'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(location)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(location.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}