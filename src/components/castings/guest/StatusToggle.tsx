import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { GuestFilters } from "@/types/guest-filters";

interface StatusToggleProps {
  filterKey: keyof GuestFilters;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export const StatusToggle: React.FC<StatusToggleProps> = ({
  label,
  value,
  onChange
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={value}
        onCheckedChange={onChange}
        id={`toggle-${label}`}
      />
      <Label htmlFor={`toggle-${label}`}>{label}</Label>
    </div>
  );
};