import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { TalentProfile } from "@/types/talent";

interface EmailRecipientListProps {
  selectedTalents: TalentProfile[];
  onRemove?: (talentId: string) => void;
}

export const EmailRecipientList: React.FC<EmailRecipientListProps> = ({
  selectedTalents,
  onRemove
}) => {
  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium mb-2">Recipients ({selectedTalents.length})</h4>
      <ScrollArea className="h-20">
        <div className="flex flex-wrap gap-2">
          {selectedTalents.map((talent) => (
            <Badge 
              key={talent.id} 
              variant="secondary"
              onClick={() => onRemove?.(talent.id)}
              className={onRemove ? "cursor-pointer" : ""}
            >
              {talent.users.full_name}
            </Badge>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};