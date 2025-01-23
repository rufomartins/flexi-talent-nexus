import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useClientSelection } from '../../hooks/useClientSelection';
import type { ClientSelection } from '../../types';

interface ClientSelectionInterfaceProps {
  castingId: string;
  talentId: string;
  initialSelection?: ClientSelection;
}

export const ClientSelectionInterface: React.FC<ClientSelectionInterfaceProps> = ({
  castingId,
  talentId,
  initialSelection
}) => {
  const [preference, setPreference] = React.useState<number>(initialSelection?.preference || 0);
  const [comments, setComments] = React.useState<string>(initialSelection?.comments || '');
  const { updateSelection, finalizeSelections } = useClientSelection(castingId);

  const handleUpdateSelection = async (status: ClientSelection['status']) => {
    await updateSelection(talentId, preference, status);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Talent Selection</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">Preference Order</label>
          <input
            type="number"
            min="1"
            value={preference}
            onChange={(e) => setPreference(parseInt(e.target.value))}
            className="w-20 px-2 py-1 border rounded"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Comments</label>
          <Textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add your comments about this talent..."
          />
        </div>

        <div className="flex gap-4">
          <Button 
            variant="outline"
            onClick={() => handleUpdateSelection('rejected')}
          >
            Reject
          </Button>
          <Button 
            variant="secondary"
            onClick={() => handleUpdateSelection('waitlist')}
          >
            Waitlist
          </Button>
          <Button 
            onClick={() => handleUpdateSelection('selected')}
          >
            Select
          </Button>
        </div>
      </div>
    </Card>
  );
}