import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Location } from '@/types/shot-list';
import { Label } from '@/components/ui/label';

interface LocationFormProps {
  location?: Location;
  onSubmit: (data: Partial<Location>) => Promise<void>;
  isLoading?: boolean;
}

export function LocationForm({ location, onSubmit, isLoading }: LocationFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Location>>({
    defaultValues: location || {
      name: '',
      address: '',
      time_of_day: '',
      special_requirements: '',
      status: 'Pending'
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Location Name *</Label>
        <Input
          id="name"
          {...register('name', { required: 'Location name is required' })}
          placeholder="Enter location name"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          {...register('address')}
          placeholder="Enter address"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="time_of_day">Time of Day</Label>
        <Input
          id="time_of_day"
          {...register('time_of_day')}
          placeholder="e.g., Morning, Afternoon, Evening"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="special_requirements">Special Requirements</Label>
        <Textarea
          id="special_requirements"
          {...register('special_requirements')}
          placeholder="Enter any special requirements"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          defaultValue={location?.status || 'Pending'}
          onValueChange={(value) => register('status').onChange({ target: { value } })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : location ? 'Update Location' : 'Add Location'}
        </Button>
      </div>
    </form>
  );
}