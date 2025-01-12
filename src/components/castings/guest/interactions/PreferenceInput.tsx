import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface PreferenceInputProps {
  currentRank?: number;
  onRankChange: (rank: number) => Promise<void>;
  disabled?: boolean;
}

export function PreferenceInput({ currentRank, onRankChange, disabled = false }: PreferenceInputProps) {
  const [value, setValue] = useState(currentRank?.toString() || "");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setValue(currentRank?.toString() || "");
  }, [currentRank]);

  const handleChange = async (newValue: string) => {
    setValue(newValue);
    const numValue = parseInt(newValue);
    
    if (!isNaN(numValue) && numValue > 0) {
      try {
        setIsUpdating(true);
        await onRankChange(numValue);
      } catch (error) {
        console.error("Failed to update rank:", error);
        setValue(currentRank?.toString() || "");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <div className="relative w-20">
      <Input
        type="number"
        min="1"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        disabled={disabled || isUpdating}
        className="pr-8"
        placeholder="Rank"
      />
      {isUpdating && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
    </div>
  );
}