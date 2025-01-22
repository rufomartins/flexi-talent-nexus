import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterSection } from "./FilterSection";

interface StatusFilterProps {
  label: string;
  value?: string;
  options: string[];
  onChange: (value: string) => void;
}

export function StatusFilter({ label, value, options, onChange }: StatusFilterProps) {
  return (
    <FilterSection label={label}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option.toLowerCase()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FilterSection>
  );
}