import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { notify } from '@/utils/notifications';
import { supabase } from '@/integrations/supabase/client';
import { Location } from '@/types/shot-list';
import { useLoadingState } from '@/hooks/useLoadingState';
import { LocationForm } from './location/LocationForm';
import { LocationTable } from './location/LocationTable';

export function LocationsTab({ shotListId }: { shotListId: string }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const { loadingStates, startLoading, stopLoading } = useLoadingState();

  // Fetch locations
  const { data: locations = [], refetch } = useQuery({
    queryKey: ['locations', shotListId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('shot_list_id', shotListId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Location[];
    }
  });

  // Add new location
  const handleAdd = async (formData: Partial<Location>) => {
    try {
      startLoading('add');
      const { error } = await supabase
        .from('locations')
        .insert([{ ...formData, shot_list_id: shotListId }]);

      if (error) throw error;
      
      notify.success('Location added successfully');
      setIsAddDialogOpen(false);
      refetch();
    } catch (error) {
      notify.error('Failed to add location');
      console.error('Error adding location:', error);
    } finally {
      stopLoading('add');
    }
  };

  // Update location
  const handleEdit = async (formData: Partial<Location>) => {
    if (!editingLocation) return;

    try {
      startLoading('edit');
      const { error } = await supabase
        .from('locations')
        .update(formData)
        .eq('id', editingLocation.id);

      if (error) throw error;
      
      notify.success('Location updated successfully');
      setEditingLocation(null);
      refetch();
    } catch (error) {
      notify.error('Failed to update location');
      console.error('Error updating location:', error);
    } finally {
      stopLoading('edit');
    }
  };

  // Delete location
  const handleDelete = async (id: string) => {
    try {
      startLoading('delete');
      
      // First, update any shots that reference this location
      await supabase
        .from('shots')
        .update({ location_id: null })
        .eq('location_id', id);

      // Then delete the location
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      notify.success('Location deleted successfully');
      refetch();
    } catch (error) {
      notify.error('Failed to delete location');
      console.error('Error deleting location:', error);
    } finally {
      stopLoading('delete');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Locations</h2>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>

      <LocationTable 
        locations={locations}
        onEdit={setEditingLocation}
        onDelete={handleDelete}
        isDeleting={loadingStates['delete'] || false}
      />

      {/* Add Location Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
          </DialogHeader>
          <LocationForm 
            onSubmit={handleAdd}
            isLoading={loadingStates['add'] || false}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Location Dialog */}
      <Dialog open={!!editingLocation} onOpenChange={() => setEditingLocation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
          </DialogHeader>
          {editingLocation && (
            <LocationForm 
              location={editingLocation}
              onSubmit={handleEdit}
              isLoading={loadingStates['edit'] || false}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}