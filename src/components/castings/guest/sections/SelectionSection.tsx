import { Card, CardContent } from "@/components/ui/card";
import { TalentDisplay } from "../talent-display/TalentDisplay";
import type { SelectionSectionProps } from "@/types/guest-content";

export const SelectionSection: React.FC<SelectionSectionProps> = ({
  talents,
  selections,
  viewMode,
  isLoading,
  onSelect
}) => {
  return (
    <Card>
      <CardContent className="py-4">
        <TalentDisplay
          talents={talents}
          selections={selections}
          viewMode={viewMode}
          isLoading={isLoading}
          onSelect={onSelect}
          selectedTalents={new Set()}
          onTalentSelect={() => {}}
          sort={{ field: 'name', direction: 'asc' }}
          filters={{
            search_term: '',
            show_only_available: false,
            filter_out_rejected: false,
            show_only_approved_auditions: false
          }}
          castingId=""
          guestId=""
        />
      </CardContent>
    </Card>
  );
};