import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import type { TalentAvailability } from '../../types';

interface BookingConfirmationProps {
  castingId: string;
  talentId: string;
  availability: TalentAvailability;
  onConfirm: (data: {
    dates: Date[];
    finalFee: number;
  }) => Promise<void>;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  castingId,
  talentId,
  availability,
  onConfirm
}) => {
  const [selectedDates, setSelectedDates] = React.useState<Date[]>([]);
  const [finalFee, setFinalFee] = React.useState<string>(
    availability.finalFee?.toString() || availability.proposedFee?.toString() || ''
  );
  const { toast } = useToast();

  const handleConfirm = async () => {
    try {
      if (!selectedDates.length) {
        throw new Error('Please select booking dates');
      }

      if (!finalFee) {
        throw new Error('Please set the final fee');
      }

      await onConfirm({
        dates: selectedDates,
        finalFee: parseFloat(finalFee)
      });

      toast({
        title: "Booking Confirmed",
        description: "The talent has been successfully booked.",
      });
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Failed to confirm booking",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Booking Confirmation</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">Select Booking Dates</label>
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={(dates) => setSelectedDates(dates || [])}
            className="rounded-md border"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Final Fee</label>
          <Input
            type="number"
            value={finalFee}
            onChange={(e) => setFinalFee(e.target.value)}
            placeholder="Enter final fee"
          />
        </div>

        <Button 
          onClick={handleConfirm}
          className="w-full"
        >
          Confirm Booking
        </Button>
      </div>
    </Card>
  );
}