import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectionControlsProps {
  onPreferenceChange: (talentId: string, order: number) => void;
  onLikeToggle: (talentId: string) => void;
  onCommentAdd: (talentId: string, comment: string) => void;
}

export const SelectionControls: React.FC<SelectionControlsProps> = ({
  onPreferenceChange,
  onLikeToggle,
  onCommentAdd,
}) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border-t sticky bottom-0">
      <Select onValueChange={(value) => console.log(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by round" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">First round</SelectItem>
          <SelectItem value="2">Second round</SelectItem>
          <SelectItem value="3">Third round</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={() => console.log("Save selections")}>
        Save Selections
      </Button>
    </div>
  );
};