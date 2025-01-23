import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAvailabilityManagement } from '../../hooks/useAvailabilityManagement';
import type { TalentAvailability } from '../../types';

interface AvailabilityManagerProps {
  castingId: string;
  talentId: string;
  initialAvailability?: TalentAvailability;
}

export const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({
  castingId,
  talentId,
  initialAvailability
}) => {
  const [selectedDates, setSelectedDates] = React.useState<Date[]>([]);
  const [proposedFee, setProposedFee] = React.useState<string>('');
  const { requestAvailability, updateAvailability } = useAvailabilityManagement(castingId);

  const handleAvailabilityRequest = async () => {
    await requestAvailability(talentId, selectedDates);
  };

  const handleAvailabilityResponse = async (status: 'available' | 'unavailable') => {
    await updateAvailability(talentId, status, {
      proposedFee: proposedFee ? parseFloat(proposedFee) : undefined,
      dates: selectedDates.map(date => ({
        from: date.toISOString(),
        to: date.toISOString()
      }))
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Availability Management</h3>
        
        <div>
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={(dates) => setSelectedDates(dates || [])}
            className="rounded-md border"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Proposed Fee</label>
          <Input
            type="number"
            value={proposedFee}
            onChange={(e) => setProposedFee(e.target.value)}
            placeholder="Enter proposed fee"
          />
        </div>

        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => handleAvailabilityResponse('unavailable')}
          >
            Not Available
          </Button>
          <Button 
            onClick={() => handleAvailabilityResponse('available')}
          >
            Confirm Availability
          </Button>
        </div>
      </div>
    </Card>
  );
}