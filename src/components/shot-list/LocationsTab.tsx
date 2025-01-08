import { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { notify } from '@/utils/notifications';
import { Location, Shot } from '@/types/shot-list';
import { useLoadingState } from '@/hooks/useLoadingState';
import { useLocations } from '@/hooks/useLocations';
import { LocationForm } from './location/LocationForm';
import { LocationTable } from './location/LocationTable';
import { LocationDeleteDialog } from './location/LocationDeleteDialog';
import { supabase } from '@/integrations/supabase/client';

export function LocationsTab({ shotListId }: { shotListId: string }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [deletingLocation, setDeletingLocation] = useState<Location | null>(null);
  const [affectedShots, setAffectedShots] = useState<Shot[]>([]);
  const { loadingStates, startLoading, stopLoading } = useLoadingState();

  const { data: locations = [], refetch, checkLocationUsage, deleteLocation } = useLocations(shotListId);

  const handleAdd = async (formData: Partial<Location>) => {
    if (!formData.name) {
      notify.error('Location name is required');
      return;
    }

    try {
      startLoading('add');
      const { error } = await supabase
        .from('locations')
        .insert([{ 
          ...formData, 
          shot_list_id: shotListId,
          name: formData.name
        }]);

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

  const handleEdit = async (formData: Partial<Location>) => {
    if (!editingLocation || !formData.name) {
      notify.error('Location name is required');
      return;
    }

    try {
      startLoading('edit');
      const { error } = await supabase
        .from('locations')
        .update({
          name: formData.name,
          address: formData.address,
          time_of_day: formData.time_of_day,
          special_requirements: formData.special_requirements,
          status: formData.status
        })
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

  const handleDeleteClick = async (location: Location) => {
    try {
      startLoading('checkUsage');
      const shots = await checkLocationUsage(location.id);
      setAffectedShots(shots);
      setDeletingLocation(location);
    } catch (error) {
      notify.error('Failed to check location usage');
      console.error('Error checking location usage:', error);
    } finally {
      stopLoading('checkUsage');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingLocation) return;

    try {
      startLoading('delete');
      await deleteLocation(deletingLocation.id);
      setDeletingLocation(null);
      setAffectedShots([]);
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
        onDelete={handleDeleteClick}
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

      {/* Delete Location Dialog */}
      {deletingLocation && (
        <LocationDeleteDialog
          location={deletingLocation}
          isOpen={!!deletingLocation}
          onClose={() => setDeletingLocation(null)}
          onConfirm={handleDeleteConfirm}
          affectedShots={affectedShots}
          isLoading={loadingStates['delete'] || false}
        />
      )}
    </div>
  );
}