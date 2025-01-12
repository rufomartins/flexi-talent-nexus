import { TalentDisplayProps } from "./types";
import { TalentGrid } from "./TalentGrid";
import { TalentList } from "./TalentList";

export function TalentDisplay({ viewMode, ...props }: TalentDisplayProps) {
  if (viewMode === 'grid') {
    return <TalentGrid {...props} viewMode={viewMode} />;
  }
  return <TalentList {...props} viewMode={viewMode} />;
}